const { gql } = require('apollo-server-express');

const schema = gql`
  type Token {
    accessToken: AccessToken!
    refreshToken: RefreshToken
  }
`;

module.exports = schema;
