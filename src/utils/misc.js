const { startCase, toLower, upperFirst } = require('lodash');
const moment = require('moment');
const { getStatusText, BAD_REQUEST } = require('http-status-codes');
const { ApolloError } = require('apollo-server-express');
const Joi = require('@hapi/joi');
const { otpDev, invalidReq } = require('../constants');

const validationOptions = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

const ucfirst = (string) => startCase(toLower(string));

const ucwords = (string) => upperFirst(string);

const dateNow = () => moment().unix();

const dateAdd = (duration, unit) => moment().add(duration, unit).unix();

const range = (from, to, length = to - from) => Array.from({ length }, (_, i) => from + i);

const validator = (args, schema) => {
  try {
    Joi.assert(args, schema, validationOptions);
  } catch (error) {
    throw new ApolloError(invalidReq, getStatusText(BAD_REQUEST), {
      errors: error.details.map((obj) => ({ message: obj.message.replace(/['"]/g, '') })),
    });
  }
};

const generateOTP = (length) => {
  if (process.env.NODE_ENV === 'development') return otpDev;
  return range(0, length)
    .map((i) => Math.floor(Math.random() * 10))
    .join('');
};

const linkUser = (_from, _to) => ({
  _from,
  _to,
  createdAt: dateNow(),
});

module.exports = {
  generateOTP,
  validator,
  ucfirst,
  ucwords,
  dateNow,
  dateAdd,
  range,
  linkUser,
};
