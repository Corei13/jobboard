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
  GraphQLInputObjectType
} = require('graphql');

const { getUser } = require('./resolvers');

const Token = new GraphQLObjectType({
  name: 'Token',
  fields: () => ({
    token: { type: GraphQLNonNull(GraphQLString) },
    me: {
      type: User,
      resolve: me => me
    }
  })
});

const UserRole = new GraphQLEnumType({
  name: 'role',
  values: {
    candidate: { value: 'candidate' },
    employer: { value: 'employer' },
    admin: { value: 'admin' }
  }
});

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


module.exports = {
  Token,
  SignUpData,
  SignInData,
  User,
  Apartment,
  ApartmentState,
  ApartmentList,
  Status
};
