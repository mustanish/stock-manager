const enums = require('./enums');
const inputs = require('./inputs');
const types = require('./types');
const querySchema = require('./Query');
const mutationSchema = require('./Mutation');

module.exports = [...enums, ...inputs, ...types, querySchema, mutationSchema];
