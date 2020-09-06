const express = require('express');
const { ApolloServer, ApolloError } = require('apollo-server-express');
const { getStatusText, UNAUTHORIZED } = require('http-status-codes');
const helmet = require('helmet');
const morgan = require('morgan');
const token = require('./src/utils/token');
const logger = require('./src/utils/logger');
const typeDefs = require('./src/typeDefs');
const resolvers = require('./src/resolvers');
const models = require('./src/models');
const connectors = require('./src/connectors');
const { invalidToken } = require('./src/constants');

const app = express();

const getMe = async (req) => {
  const authToken = req.headers['x-token'];
  if (!authToken) return null;
  const { ID, tokenID, tokenType } = token.verifyToken(authToken);
  const exist = await models.User.checkToken(tokenID);
  if (!exist) {
    throw new ApolloError(invalidToken, getStatusText(UNAUTHORIZED));
  }
  return { ID, tokenID, tokenType };
};

const graphql = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    const message = error.message.replace('Context creation failed: ', '');
    return {
      ...error,
      message,
    };
  },
  context: async ({ req }) => {
    const me = await getMe(req);
    return { models, me };
  },
});

app.use(morgan('combined', { stream: logger.stream }));
app.use(helmet());
graphql.applyMiddleware({ app, path: '/hisab-kitab' });
connectors.Initialize();

module.exports = app;
