const Joi = require('@hapi/joi');
const { emailRegex, phoneRegex } = require('../constants');

const email = Joi.string().regex(emailRegex);
const phoneNumber = Joi.string().regex(phoneRegex);

const schema = Joi.object().keys({
  email: email.trim().messages({
    'string.pattern.base': 'Email ID that you entered is not valid',
  }),
  phoneNumber: phoneNumber.trim().required().messages({
    'string.pattern.base': 'Phone number that you entered is not valid',
  }),
});

module.exports = schema;
