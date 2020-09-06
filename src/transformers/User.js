const bcrypt = require('bcrypt');
const { ApolloError } = require('apollo-server-express');
const { getStatusText, BAD_REQUEST } = require('http-status-codes');
const { invalidPwd, invalidOtp } = require('../constants');
const { misc } = require('../utils');

const register = (args) => {
  const { name, email, password } = args;
  const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  return { name, email, password: hash, createdAt: misc.dateNow(), lastLogedIn: misc.dateNow() };
};

const login = (args, password) => {
  if (!bcrypt.compareSync(args.password, password)) {
    throw new ApolloError(invalidPwd, getStatusText(BAD_REQUEST));
  }
  return { updatedAt: misc.dateNow(), lastLogedIn: misc.dateNow() };
};

const forgot = (otp, validity) => {
  const hash = bcrypt.hashSync(otp, bcrypt.genSaltSync(10));
  const otpValidity = misc.dateAdd(validity, 'seconds');
  return { otp: hash, otpValidity, updatedAt: misc.dateNow() };
};

const verify = (args, { otp, otpValidity, email }) => {
  if (!bcrypt.compareSync(args.otp, otp) || args.email !== email) {
    throw new ApolloError(invalidOtp, getStatusText(BAD_REQUEST));
  }
  return { otp: null, otpValidity: null, updatedAt: misc.dateNow() };
};

const reset = ({ password }) => {
  const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  return { password: hash, updatedAt: misc.dateNow() };
};

const generateToken = (tokenID, tokenType, tokenExpires) => ({
  _key: tokenID,
  type: tokenType,
  expiresAt: tokenExpires,
  createdAt: misc.dateNow(),
});

module.exports = {
  register,
  login,
  forgot,
  verify,
  reset,
  generateToken,
};
