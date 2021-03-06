const { GraphQLSchema, GraphQLObjectType } = require('graphql');

const { GetUser, GetMe, GetJobs, GetJob } = require('./queries');
const { SignUp, SignIn, SaveCandidateProfile, SaveCompanyProfile, Apply } = require('./mutations');

const RootQueryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    user: GetUser,
    me: GetMe,
    jobs: GetJobs,
    job: GetJob,
  })
});

const RootMutationType = new GraphQLObjectType({
  name: 'RootMutation',
  fields: () => ({
    SignUp,
    SignIn,
    SaveCandidateProfile,
    SaveCompanyProfile,
    Apply
  })
});

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});
