const { getStatusText, UNAUTHORIZED } = require('http-status-codes');
const { ApolloError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { jwtsecret, invalidToken } = require('../constants');

const generateToken = (ID, validity, tokenType) => {
  const tokenID = uuidv4();
  const tokenExpires = moment().add(validity, 'seconds').unix();
  const tokenString = jwt.sign({ ID, tokenID, tokenType }, jwtsecret, { expiresIn: validity });
  return { tokenString, tokenID, tokenExpires };
};

const verifyToken = (tokenString) => {
  try {
    return jwt.verify(tokenString, jwtsecret);
  } catch (error) {
    throw new ApolloError(invalidToken, getStatusText(UNAUTHORIZED));
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
