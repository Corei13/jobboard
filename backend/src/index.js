const express = require('express');
const graphql = require('express-graphql');
const cors = require('cors');
const knex = require('./knex');
const Schema = require('./schema');
const { decodeJwt } = require('./utils');

const app = express();
app.use(cors());

const getToken = async req => {
  if (!(req.headers && req.headers.authorization)) {
    throw new Error(`Invalid/missing token.`);
  }

  const token = await decodeJwt(req);

  if (token.exp * 1000 < Date.now()) {
    throw new Error(`Token expired. Please sign in again.`);
  }

  return token;
};

app.use('/graphql', cors(), async (req, res) => {
  const user = await getToken(req).catch(() => ({}));
  return knex.transaction(trx =>
    graphql({
      schema: Schema,
      graphiql: true,
      context: { knex: trx, req, user }
    })(req, res)
  );
});

app.listen(4015, () => console.log('Express GraphQL Server Now Running On localhost:4015/graphql'));
