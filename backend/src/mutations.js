const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID
} = require('graphql');

const { SignUpData, SignInData, Token, Status, CandidateProfile, CandidateProfileData, CompanyProfileData } = require('./types');
const { signToken, hash, verify, knex$update } = require('./utils');
const { getUser, getCandidateProfile } = require('./resolvers');

module.exports = {
  SignUp: {
    type: Token,
    args: {
      data: { type: new GraphQLNonNull(SignUpData) },
    },
    resolve: async (obj, { data: { email, first_name, last_name, password, role } }, { knex }) => {
      try {
        const [id] = await knex('users').insert({
          email,
          first_name,
          last_name,
          password: await hash(password),
          role
        });

        if (role === 'candidate') {
          await knex('candidates').insert({ user_id: id });
        } else if (role === 'employer') {
          await knex('employers').insert({ user_id: id });
          const [companyId] = await knex('companies').insert({ created_by: id });
          await knex('affiliations').insert({ user_id: id, company_id: companyId });
          await knex('jobs').insert({ company_id: companyId, created_by: id });
        }

        const user = await getUser({ email }, { knex });
        const token = await signToken(user);
        return { me: { user }, token };

      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          throw new Error('Email address is already in use.');
        } else {
          throw err;
        }
      }
    }
  },

  SignIn: {
    type: Token,
    args: {
      data: { type: new GraphQLNonNull(SignInData) },
    },
    resolve: async (obj, { data: { email, password } }, { knex }) => {
      const user = await getUser({ email }, { knex });

      if (!user) {
        throw new Error(`Invalid email address.`);
      } else if (await verify(password, user.password)) {
        const token = await signToken(user);
        return { me: { user }, token };
      } else {
        throw new Error(`Invalid password!`);
      }
    }
  },

  VerifyEmail: {
    type: Status,
    args: {
      email: { type: new GraphQLNonNull(GraphQLString) },
      code: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, { email, code }, { knex }) => {
      const user = await getUser({ email }, { knex });
      if (!user) {
        throw new Error(`Email does not exist`);
      }
      if (!await verify(email, code)) {
        throw new Error(`Invalid verification code`);
      }
      await knex('users').where({ email }).update('verified_at', new Date());
      return { success: true };
    }
  },

  SaveCandidateProfile: {
    type: Status,
    args: {
      data: { type: new GraphQLNonNull(CandidateProfileData) }
    },
    resolve: async (_, { data }, { user: { id, role }, knex }) => {
      if (role !== 'candidate') {
        throw new Error('Unauthorized');
      }

      const {
        first_name,
        last_name,

        linkedin,

        location,
        us_citizen,
        us_green_card,
        us_work_visa,
        us_student,
        uk_eu_citizen,
        special_citizen,

        remote,

        status
      } = data;

      await knex$update(knex, 'users', { id }, { first_name, last_name });

      await knex$update(knex, 'candidates', { user_id: id }, {
        linkedin,
        location,
        citizenship: JSON.stringify({
          us_citizen,
          us_green_card,
          us_work_visa,
          us_student,
          uk_eu_citizen,
          special_citizen,
        }),

        remote,
        status: JSON.stringify(status)
      });
      return { success: true };
    }
  },

  SaveCompanyProfile: {
    type: Status,
    args: {
      companyId: { type: new GraphQLNonNull(GraphQLID) },
      jobId: { type: new GraphQLNonNull(GraphQLID) },
      data: { type: new GraphQLNonNull(CompanyProfileData) }
    },
    resolve: async (_, { companyId, jobId, data }, { user: { role }, knex }) => {
      if (role !== 'employer') {
        throw new Error('Unauthorized');
      }

      // TODO: check if user is associated with companyId and jobId

      const {
        name,
        url,
        logo,
        about,
        location,
        description,
        size,
        remote,

        status
      } = data;

      await knex$update(
        knex, 'companies', { id: companyId },
        { name, size, url, logo, about }
      );

      await knex$update(
        knex, 'jobs', { id: jobId },
        { location, description, remote, status: JSON.stringify(status), available: status.Job && status.Company }
      );
      return { success: true };
    }
  },

  Apply: {
    type: Status,
    args: {
      jobId: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: async (_, { jobId }, { user: { id: userId, role }, knex }) => {
      console.log({ role });
      if (role !== 'candidate') {
        throw new Error(`You have to be a candidate to apply for jobs`);
      }

      const job = await knex('jobs')
        .select('available')
        .where({ id: jobId })
        .first();

      console.log({ job });
      
      if (!job || !job.available) {
        throw new Error(`Job ${jobId} is not available`);
      }

      try {
        await knex('applications')
          .insert({ user_id: userId, job_id: jobId });
          return { success: true };
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          throw new Error(`You've already applied for job ${jobId}`);
        } else {
          throw err;
        }
      }
    }
  }
};
