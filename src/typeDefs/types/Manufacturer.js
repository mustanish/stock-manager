const { gql } = require('apollo-server-express');

const schema = gql`
  type Manufacturer {
    id: ID!
    name: String!
  }
`;

module.exports = schema;
