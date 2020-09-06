const { gql } = require('apollo-server-express');

const schema = gql`
  type Variant {
    name: String!
    unit: UnitType!
  }
`;

module.exports = schema;
