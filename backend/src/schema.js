const { GraphQLSchema, GraphQLObjectType } = require('graphql');

const { GetApartment, ListApartments, ListUsers, GetUser } = require('./queries');
const { SignUp, SignIn, NewApartment, UpdateApartment, DeleteApartment, VerifyEmail, UpdateUser } = require('./mutations');

const RootQueryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    user: GetUser,
  })
});

const RootMutationType = new GraphQLObjectType({
  name: 'RootMutation',
  fields: () => ({
    SignUp,
    SignIn,

    // SaveCandidateProfile,
    // SaveCompanyProfile,
  })
});

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});
