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

const getCompany = ({ id, created_by }, { knex }) =>
  knex('companies')
    .where({ ...(id && { id }), ...(created_by && { created_by }) })
    .first();

const getCandidateProfile = ({ id }, { knex }) =>
  knex('candidates')
    .select('linkedin', 'location', 'remote', 'status', {
      isUsResident: 'us_resident',
      isSpecialCountry: 'special_country',
      isUsStudent: 'us_student',
      currentVisa: 'current_visa',
    })
    .where({ user_id: id })
    .first();

const getJobDetails = ({ employer_id }, { knex }) =>
  knex('jobs as j')
    .select(
      `j.id`, `j.company_id`, 'j.location', 'j.remote', 'j.description', 'j.status',
      'c.name', 'c.url', 'c.logo', 'c.size', 'c.about'
    )
    .join('companies as c', 'c.id', '=', 'j.company_id')
    .join('affiliations as af', 'af.company_id', '=', 'j.company_id')
    .where({ 'af.user_id': employer_id })
    .first();

const getJobs = ({ candidate_id, company_id, employer_id, available = 1, offset = 0, size = 1 }, { knex }) =>
  knex.raw(`
    select
      j.id, j.company_id, j.location, j.remote, j.description,
      c.name, c.url, c.logo,
      c.size, c.about ${candidate_id ? `, a.id is not null as applied` : ''}
    from jobs j
    join companies c on c.id = j.company_id
    ${candidate_id ? `left join applications a on a.job_id = j.id and a.user_id = ${candidate_id}` : ''}
    ${employer_id ? `join affiliations af on af.company_id = j.company_id and af.user_id = ${employer_id}` : ''}
    where
      ${available ? `j.available = ${available}` : '1'}
      and ${company_id ? `j.company_id = ${company_id}` : '1'}
    limit ${size} offset ${offset}
`).then(([rows]) => rows);

const getTotalJobs = ({}, { knex }) =>
  knex.raw(`
    select sum(1) as total
    from jobs j
    join companies c on c.id = j.company_id
    where j.available = 1
  `).then(([[{ total }]]) => total);

module.exports = {
  getUser,
  getCandidateProfile,
  getJobDetails,
  getCompany,
  getApartment,
  listUsers,
  listApartments,
  getJobs,
  getTotalJobs
};
