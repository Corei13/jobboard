const { lorem, internet, address, random } = require('faker');
const fs = require('fs');
const path = require('path');
const knex = require('./knex');

const users = [
  { id: 101, role: 'candidate', first_name: 'Candidate', last_name: 'One', email: 'one@candidate.io', password: '00000008000186a0f9e2d46e2317cf39496a1e5eb9ae3cf2db1a210951929291' },
  { id: 102, role: 'candidate', first_name: 'Candidate', last_name: 'Two', email: 'two@candidate.io', password: '00000008000186a0f9e2d46e2317cf39496a1e5eb9ae3cf2db1a210951929291' },
  { id: 103, role: 'candidate', first_name: 'Candidate', last_name: 'Three', email: 'three@candidate.io', password: '00000008000186a0f9e2d46e2317cf39496a1e5eb9ae3cf2db1a210951929291' },
  { id: 104, role: 'candidate', first_name: 'Candidate', last_name: 'Four', email: 'four@candidate.io', password: '00000008000186a0f9e2d46e2317cf39496a1e5eb9ae3cf2db1a210951929291' },
  { id: 105, role: 'candidate', first_name: 'Candidate', last_name: 'Five', email: 'five@candidate.io', password: '00000008000186a0f9e2d46e2317cf39496a1e5eb9ae3cf2db1a210951929291' },

  { id: 201, role: 'employer', first_name: 'BTC', last_name: 'One', email: 'one@btc.io', password: '00000008000186a0f9e2d46e2317cf39496a1e5eb9ae3cf2db1a210951929291' },
  { id: 202, role: 'employer', first_name: 'BTC', last_name: 'Two', email: 'two@btc.io', password: '00000008000186a0f9e2d46e2317cf39496a1e5eb9ae3cf2db1a210951929291' },
  { id: 203, role: 'employer', first_name: 'ETH', last_name: 'Three', email: 'three@eth.io', password: '00000008000186a0f9e2d46e2317cf39496a1e5eb9ae3cf2db1a210951929291' },
  { id: 204, role: 'employer', first_name: 'XRP', last_name: 'Four', email: 'four@xrp.io', password: '00000008000186a0f9e2d46e2317cf39496a1e5eb9ae3cf2db1a210951929291' },
  { id: 205, role: 'employer', first_name: 'LTC', last_name: 'Five', email: 'five@ltc.io', password: '00000008000186a0f9e2d46e2317cf39496a1e5eb9ae3cf2db1a210951929291' },
  { id: 206, role: 'employer', first_name: 'XVG', last_name: 'Six', email: 'six@xvg.io', password: '00000008000186a0f9e2d46e2317cf39496a1e5eb9ae3cf2db1a210951929291' },
];

const visa = () => random.arrayElement(['O1', 'H1B', 'H1B1_E3_TN', 'OPT_CPT_F1', 'NA']);
const remote = () => random.arrayElement(['NO', 'OPEN', 'ONLY']);

const candidates = [
  {
    user_id: 101,
    linkedin: `https://www.linkedin.com/in/${internet.userName()}/`,
    location: `${address.city()}, ${address.country()}`,
    us_resident: random.boolean(),
    special_country: random.boolean(),
    us_student: random.boolean(),
    current_visa: visa(),
    remote: remote()
  },
  {
    user_id: 102,
    linkedin: `https://www.linkedin.com/in/${internet.userName()}/`,
    location: `${address.city()}, ${address.country()}`,
    us_resident: random.boolean(),
    special_country: random.boolean(),
    us_student: random.boolean(),
    current_visa: visa(),
    remote: remote()
  },
  {
    user_id: 103,
    linkedin: `https://www.linkedin.com/in/${internet.userName()}/`,
    location: `${address.city()}, ${address.country()}`,
    us_resident: random.boolean(),
    special_country: random.boolean(),
    us_student: random.boolean(),
    current_visa: visa(),
    remote: remote()
  }
];

const employers = users.filter(u => u.role === 'employer').map(({ id: user_id }) => ({ user_id }));

const size = () => random.arrayElement(['_5', '_5_10', '_10_50', '_50_100', '_100_']);

const companies = [
  { id: 101, name: 'Bitcoin', size: size(), url: 'https://bitcoin.org', logo: 'https://s2.coinmarketcap.com/static/img/coins/32x32/1.png', about: lorem.paragraph(), created_by: 201 },
  { id: 102, name: 'Ethereum', size: size(), url: 'https://www.ethereum.org/', logo: 'https://s2.coinmarketcap.com/static/img/coins/32x32/1027.png', about: lorem.paragraph(), created_by: 203 },
  { id: 103, name: 'Ripple', size: size(), url: 'https://ripple.com/xrp/', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png', about: lorem.paragraph(), created_by: 204 },
  { id: 104, name: 'Litecoin', size: size(), url: 'https://litecoin.org/', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2.png', about: lorem.paragraph(), created_by: 205 },
  { id: 105, name: 'Verge', size: size(), url: 'http://vergecurrency.com/', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/693.png', about: lorem.paragraph(), created_by: 206 },
];

const affiliations = [
  { user_id: 201, company_id: 101 },
  { user_id: 202, company_id: 101 },
  { user_id: 203, company_id: 102 },
  { user_id: 204, company_id: 103 },
  { user_id: 205, company_id: 104 },
  { user_id: 206, company_id: 105 },
];

const jobs = [
  { id: 10101, company_id: 101, available: true, location: 'NY', remote: remote(), description: lorem.paragraphs(), created_by: 202 },
  { id: 10201, company_id: 102, available: true, location: 'LA', remote: remote(), description: lorem.paragraphs(), created_by: 203 },
  { id: 10301, company_id: 103, available: true, location: 'DC', remote: remote(), description: lorem.paragraphs(), created_by: 204 },
  { id: 10401, company_id: 104, available: true, location: 'IDK', remote: remote(), description: lorem.paragraphs(), created_by: 205 },
  { id: 10501, company_id: 105, available: true, location: 'Neverland', remote: remote(), description: lorem.paragraphs(), created_by: 206 },
];

const applications = [
  { user_id: 101, job_id: 10101 },
  { user_id: 101, job_id: 10201 },
  { user_id: 101, job_id: 10301 },

  { user_id: 102, job_id: 10101 },
  { user_id: 102, job_id: 10201 },
  { user_id: 102, job_id: 10401 },

  { user_id: 103, job_id: 10301 },
  { user_id: 103, job_id: 10401 },
];

// module.exports = { users, candidates, employers, companies, affiliations, jobs, applications };

(async () => {
  const data = {
    users,
    candidates,
    employers,
    companies,
    affiliations,
    jobs,
    applications,
  };

  const schema = fs.readFileSync(path.resolve(__dirname, '../schema.sql')).toString().split(';').map(q => q.trim()).filter(q => q.length);
  const tables = schema.map(q => /create\s+table\s+([a-z_]+)/.exec(q)[1]);

  for(const table of tables.reverse()) {
    try {
      await knex.schema.dropTable(table);
    } catch (err) {
      console.warn(err.message);
    }
  }
  for (const q of schema) {
    await knex.raw(q);
  }
  if (process.env.SKIP_INSERT !== 'true') {
    for (const [table, rows] of Object.entries(data)) {
      await knex(table).insert(rows);
    }
  }
})().then(() => process.exit(0), console.error);
