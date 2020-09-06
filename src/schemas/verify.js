const Joi = require('@hapi/joi');
const { otpLength } = require('../constants');

const schema = Joi.object().keys({
  email: Joi.string().trim().email().required(),
  otp: Joi.string().trim().required().length(otpLength),
});

module.exports = schema;
