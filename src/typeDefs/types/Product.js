const { gql } = require('apollo-server-express');

const schema = gql`
  type Product {
    id: ID!
    name: String!
  }
`;

module.exports = schema;
