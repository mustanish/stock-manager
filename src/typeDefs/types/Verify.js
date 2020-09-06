const { gql } = require('apollo-server-express');

const schema = gql`
  type Verify {
    token: AccessToken!
    message: String!
  }
`;

module.exports = schema;
