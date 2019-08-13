const getApartment = ({ id }, { knex }) => knex('apartments').where({ id }).first();

const listApartments = ({ state, size = 10, offset = 0, ...filters }, { knex }) =>
  ['latitude', 'longitude', 'area', 'rent', 'rooms']
    .reduce((q, f) => {
      const { min, max } = filters[f] || {};
      if (min !== undefined) {
        q = q.andWhere(f, '>=', min);
      }
      if (max !== undefined) {
        q = q.andWhere(f, '<=', max);
      }
      return q;
    }, state ? knex('apartments').where({ state }) : knex('apartments'))
    .limit(size)
    .offset(offset);

const transformUser = ({ first_name, last_name, ...rest }) => ({
  firstName: first_name,
  lastName: last_name,
  ...rest
});

const listUsers = ({ size, offset }, { knex }) =>
  knex('users').orderBy('id').limit(size).offset(offset).then(users => users.map(transformUser));

const getUser = ({ id, email }, { knex }) =>
  knex('users')
    .where({ ...(id && { id }), ...(email && { email }) })
    .first()
    .then(res => res && transformUser(res));


module.exports = {
  getUser,
  getApartment,
  listUsers,
  listApartments
};
