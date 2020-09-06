const { gql } = require('apollo-server-express');

const schema = gql`
  input ProductInput {
    name: String!
    manufacturer: ID!
    unit: UnitType!
    categories: [ID!]!
    details: String!
  }
`;

module.exports = schema;
