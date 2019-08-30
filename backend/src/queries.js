const {
  GraphQLID,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType
} = require('graphql');

const { Me, User, Job } = require('./types');
const { getUser, getJobs, getTotalJobs, listUsers } = require('./resolvers');

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
    type: Me,
    resolve: (obj, { }, { knex, user: { id } }) => getUser({ id }, { knex }).then(user => ({ user }))
  },

  GetJobs: {
    type: new GraphQLObjectType({
      name: 'JobList',
      fields: () => ({
        list: { type: new GraphQLList(Job) },
        total: { type: GraphQLInt }
      })
    }),
    args: {
      offset: { type: new GraphQLNonNull(GraphQLInt) },
      size: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (_, { offset, size }, { knex, user: { id, role } }) => {
      if (role === 'candidate') {
        const [list, total] = await Promise.all([
          getJobs({ candidate_id: id, offset, size }, { knex }),
          getTotalJobs({ candidate_id: id }, { knex })
        ]);
        return { list, total };
      }
      throw new Error('Unauthorized');
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
