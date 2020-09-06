const { gql } = require('apollo-server-express');

const schema = gql`
  input SupplierInput {
    name: String!
    address: String!
    "phoneNumber should be comma seprated incase of multiple numbers"
    phoneNumber: String!
    "email should be comma seprated incase of multiple emails"
    email: String
    licenseNumber: String!
    gstNumber: String!
    manufacturers: [ID!]
  }
`;

module.exports = schema;
