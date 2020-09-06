const { gql } = require('apollo-server-express');

const schema = gql`
  type AccessToken {
    value: String!
    expiresIn: Int!
  }
`;

module.exports = schema;
