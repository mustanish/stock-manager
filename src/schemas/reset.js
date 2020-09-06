const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  password: Joi.string().trim().min(3).max(15).required(),
  confirmPassword: Joi.string().required().equal(Joi.ref('password')).messages({
    'any.only': 'The password and confirm password do not match',
  }),
});

module.exports = schema;
