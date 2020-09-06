const { gql } = require('apollo-server-express');

const schema = gql`
  type RefreshToken {
    value: String!
    expiresIn: Int!
  }
`;

module.exports = schema;
