const { gql } = require('apollo-server-express');

const schema = gql`
  type AuthPayload {
    token: Token!
    user: User!
  }
`;

module.exports = schema;
