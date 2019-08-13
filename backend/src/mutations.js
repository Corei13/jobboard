const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLFloat,
  GraphQLID
} = require('graphql');

const { SignUpData, SignInData, Token, Status } = require('./types');
const { signToken, hash, verify } = require('./utils');
const { getUser } = require('./resolvers');

module.exports = {
  SignUp: {
    type: Token,
    args: {
      data: { type: new GraphQLNonNull(SignUpData) },
    },
    resolve: async (obj, { data: { email, firstName, lastName, password, role } }, { knex }) => {
      try {
        await knex('users').insert({
          email,
          first_name: firstName,
          last_name: lastName,
          password: await hash(password),
          role
        });

        const user = await getUser({ email }, { knex });
        user.token = await signToken(user);
        return user;

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
        user.token = await signToken(user);
        return user;
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
};
