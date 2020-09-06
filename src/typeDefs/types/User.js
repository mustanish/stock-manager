const { gql } = require('apollo-server-express');

const schema = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }
`;

module.exports = schema;
