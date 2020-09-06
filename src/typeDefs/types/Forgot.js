const { gql } = require('apollo-server-express');

const schema = gql`
  type Forgot {
    token: AccessToken!
    message: String!
  }
`;

module.exports = schema;
