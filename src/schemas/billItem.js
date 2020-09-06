let Joi = require('@hapi/joi');
const JoiDate = require('@hapi/joi-date');

Joi = Joi.extend(JoiDate);

const schema = Joi.object().keys({
  expiryDate: Joi.date().format(['MM/YYYY', 'MM-YYYY', 'MMM.YYYY']),
});

module.exports = schema;
