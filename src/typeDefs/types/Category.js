const { gql } = require('apollo-server-express');

const schema = gql`
  type Category {
    id: ID!
    name: String!
  }
`;

module.exports = schema;
