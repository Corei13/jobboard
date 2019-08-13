const {
  GraphQLID,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList
} = require('graphql');

const { User, ApartmentState, Apartment, ApartmentList } = require('./types');
const { getUser, getApartment, listApartments, listUsers } = require('./resolvers');

const RangeType = (name, type) => new GraphQLInputObjectType({
  name,
  fields: {
    min: { type },
    max: { type }
  }
});

const ApartmentFilter = new GraphQLInputObjectType({
  name: 'ApartmentFilter',
  fields: {
    state: { type: ApartmentState },
    size: { type: GraphQLInt },
    offset: { type: GraphQLInt },
    latitude: { type: RangeType('latitude', GraphQLFloat) },
    longitude: { type: RangeType('longitude', GraphQLFloat) },
    area: { type: RangeType('area', GraphQLInt) },
    rent: { type: RangeType('rent', GraphQLInt) },
    rooms: { type: RangeType('rooms', GraphQLInt) },
  }
});

module.exports = {
  GetUser: {
    type: User,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: (obj, { id }, { knex, user: { isAdmin } = {} }) => {
      if (isAdmin) {
        return getUser({ id }, { knex });
      }
      throw new Error('Unauthorized');
    }
  },

  GetMe: {
    type: User,
    resolve: (obj, { }, { knex, user: { id } }) => getUser({ id }, { knex })
  },

  GetApartment: {
    type: Apartment,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve: (obj, { id }, { knex, user: { isRealtor } = {} }) => {
      if (!isRealtor) {
        throw new Error('Unauthorized');
      }
      return getApartment({ id }, { knex });
    }
  },

  ListApartments: {
    type: ApartmentList,
    args: {
      data: { type: new GraphQLNonNull(ApartmentFilter) }
    },
    resolve: (obj, { data }, { knex, user: { id, isRealtor } = {} }) => {
      if (id) {
        return listApartments({ ...data, state: isRealtor ? undefined : 'available' }, { knex });
      } else {
        throw new Error('Unauthorized');
      }
    }
  },

  ListUsers: {
    type: new GraphQLList(User),
    args: {
      offset: { type: new GraphQLNonNull(GraphQLInt) },
      size: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: (_, { offset, size }, { knex, user: { isAdmin } = {} }) => {
      if (isAdmin) {
        return listUsers({ offset, size }, { knex });
      }
      throw new Error('Unauthorized');
    }
  }
};
