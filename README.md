# jobboard

Development
===========

Frontend
--------
```bash
cd frontend
yarn start
```

Created with `create-react-app`, with routing handled by `react-router`. Everything is in the `src/` directory. `src/App.js` contains the all the routes.


Backend
-------
```bash
cd backend
# $JWT_KEY env used for authentication
JWT_KEY=SECREY_JWT_KEY node src/index.js
```

Everything is in the `src/` directory

filename     | description
-------------| ---
knex.js      | contains database config
mutations.js | defines all the mutation operations
queries.js   | defines all the queries
resolvers.js | defines all the helper functions to interact with database
seed.js      | initialize the database, inserts dummy data
types.js     | defines all the data types
utils.js     | contains the util functions

Deployment
===========
```bash
# start the containers
docker-compose up -d .
# set up the db (with dummy data)
docker exec -it jobboard_backend node src/seed.js
# set up the db (without dummy data)
docker exec -e SKIP_INSERT=true -it jobboard_backend node src/seed.js
```
