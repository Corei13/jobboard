const knex = require('knex');

const {
  MYSQL_HOST = '127.0.0.1',
  MYSQL_DATABASE = 'bcboard_v1',
  MYSQL_USER = 'root',
  MYSQL_PASSWORD = 'password'
} = process.env;

module.exports = knex({
  client: 'mysql',
  connection: {
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    typeCast: (field, next) => {
      if (field.type == 'TINY' && field.length == 1) {
        const value = field.string();
        return value ? (value === '1') : null;
      }
      if (field.type == 'JSON') {
        const value = field.string();
        return value === null ? {} : JSON.parse(value);
      }
      return next();
    },
    timezone: 'UTC'
  },
  pool: {
    min: 1,
    max: 1
  },
  debug: true
});
