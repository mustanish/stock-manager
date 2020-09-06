const Joi = require('@hapi/joi');

const schema = Joi.object().keys({
  email: Joi.string().trim().email().required(),
});

module.exports = schema;
