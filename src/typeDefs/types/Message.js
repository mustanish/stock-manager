const { gql } = require('apollo-server-express');

const schema = gql`
  type Message {
    message: String!
  }
`;

module.exports = schema;
