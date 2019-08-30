const {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLUnionType,
  GraphQLInputObjectType
} = require('graphql');

const { getUser, getJobDetails, getCandidateProfile } = require('./resolvers');

const $enum = (name, values) => new GraphQLEnumType({
  name,
  values: values.reduce((o, value) => ({ ...o, [value]: { value } }), {})
});

const UserRole = $enum('UserRole', ['candidate', 'employer', 'admin']);
const Remote = $enum('Remote', ['NO', 'OPEN', 'ONLY']);

const SignUpData = new GraphQLInputObjectType({
  name: 'SignUpData',
  fields: {
    email: { type: GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLNonNull(GraphQLString) },
    lastName: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    role: { type: GraphQLNonNull(UserRole) }
  }
});

const SignInData = new GraphQLInputObjectType({
  name: 'SignInData',
  fields: {
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  }
});

const ApartmentState = new GraphQLEnumType({
  name: 'state',
  values: {
    available: { value: 'available' },
    rented: { value: 'rented' },
  }
});

const Apartment = new GraphQLObjectType({
  name: 'Apartment',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },
    state: { type: GraphQLString },
    area: { type: GraphQLInt },
    rent: { type: GraphQLInt },
    rooms: { type: GraphQLInt },
    address: { type: GraphQLString },
    latitude: { type: GraphQLFloat },
    longitude: { type: GraphQLFloat },
    realtor: {
      type: User,
      resolve: async ({ realtor_id }, { }, { knex }) => getUser({ id: realtor_id }, { knex })
    }
  })
});

const ApartmentList = new GraphQLList(Apartment);

const Status = new GraphQLObjectType({
  name: 'Status',
  fields: () => ({
    success: { type: GraphQLNonNull(GraphQLBoolean) },
    message: { type: GraphQLString },
  })
});

const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    email: { type: GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLNonNull(GraphQLString) },
    lastName: { type: GraphQLNonNull(GraphQLString) },
    role: { type: GraphQLNonNull(UserRole) }
  })
});

const CandidateProfileFields = {
  linkedin: { type: GraphQLString },

  location: { type: GraphQLString },
  isUsResident: { type: GraphQLBoolean },
  isSpecialCountry: { type: GraphQLBoolean },
  isUsStudent: { type: GraphQLBoolean },
  currentVisa: { type: $enum('CurrentVisa', ['O1', 'H1B', 'H1B1_E3_TN', 'OPT_CPT_F1', 'NA']) },

  remote: { type: Remote },
};

const CandidateProfileData = new GraphQLInputObjectType({
  name: 'CandidateProfileData',
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    ...CandidateProfileFields,
    status: {
      type: new GraphQLInputObjectType({
        name: 'CandidateProfileStatusData',
        fields: () => ({
          PersonalInfo: { type: GraphQLBoolean },
          Location: { type: GraphQLBoolean },
        })
      })
    },
  }
});

const CandidateProfile = new GraphQLObjectType({
  name: 'CandidateProfile',
  fields: {
    ...CandidateProfileFields,
    complete: { type: GraphQLBoolean },
    status: {
      type: new GraphQLObjectType({
        name: 'CandidateProfileStatus',
        fields: () => ({
          PersonalInfo: { type: GraphQLBoolean },
          Location: { type: GraphQLBoolean },
        })
      })
    },
  }
});

const CompanyProfileFields = {
  name: { type: GraphQLString },
  url: { type: GraphQLString },
  logo: { type: GraphQLString },
  about: { type: GraphQLString },
  location: { type: GraphQLString },
  description: { type: GraphQLString },

  size: { type: $enum('CompanySize', ['_5', '_5_10', '_10_50', '_50_100', '_100_']) },

  remote: { type: Remote },
};


const CompanyProfileData = new GraphQLInputObjectType({
  name: 'CompanyProfileData',
  fields: {
    ...CompanyProfileFields,
    status: {
      type: new GraphQLInputObjectType({
        name: 'CompanyProfileStatusData',
        fields: () => ({
          Company: { type: GraphQLBoolean },
          Job: { type: GraphQLBoolean },
        })
      })
    },
  }
});

const Candidate = new GraphQLObjectType({
  name: 'Candidate',
  fields: () => ({
    user: { type: GraphQLNonNull(User) },
    profile: { type: GraphQLNonNull(CandidateProfile), resolve: ({ user: { id } }, { }, { knex }) => getCandidateProfile({ id }, { knex }) },
  })
});

const Company = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    url: { type: GraphQLString },
    logo: { type: GraphQLString },
    size: { type: GraphQLString },
    about: { type: GraphQLString }
  })
});

const Job = new GraphQLObjectType({
  name: 'Job',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    location: { type: GraphQLString },
    remote: { type: Remote },
    description: { type: GraphQLString },
    applied: { type: GraphQLBoolean },
    company: {
      type: Company,
      resolve: ({ company_id: id, name, url, logo, size, about }) => ({
        id, name, url, logo, size, about
      })
    },
    status: {
      type: new GraphQLObjectType({
        name: 'JobStatus',
        fields: () => ({
          Company: { type: GraphQLBoolean },
          Job: { type: GraphQLBoolean },
        })
      })
    },
  })
});

const Employer = new GraphQLObjectType({
  name: 'Employer',
  fields: () => ({
    user: { type: GraphQLNonNull(User) },
    job: {
      type: Job,
      resolve: ({ user: { id } }, {}, { knex }) => getJobDetails({ employer_id: id }, { knex })
    }
  })
});

const Me = new GraphQLUnionType({
  name: 'Me',
  types: [Candidate, Employer],
  resolveType: ({ user: { role } }) => role === 'candidate' ? Candidate : Employer
});

const Token = new GraphQLObjectType({
  name: 'Token',
  fields: () => ({
    token: { type: GraphQLNonNull(GraphQLString) },
    me: { type: Me }
  })
});

module.exports = {
  Token,
  SignUpData,
  SignInData,
  User,
  Me,
  Job,
  Candidate,
  CandidateProfile,
  CandidateProfileData,
  CompanyProfileData,
  Company,
  Apartment,
  ApartmentState,
  ApartmentList,
  Status
};
