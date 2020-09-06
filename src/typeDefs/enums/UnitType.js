const { gql } = require('apollo-server-express');

const schema = gql`
  enum UnitType {
    mg
    g
    kg
    ml
    l
    pcs
  }
`;

module.exports = schema;
