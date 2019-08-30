FROM node:10-alpine
EXPOSE 4015
WORKDIR /app

COPY package.json package.json
COPY src src
COPY schema.sql schema.sql

RUN npm install

CMD node src/index

