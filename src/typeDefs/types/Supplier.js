const { gql } = require('apollo-server-express');

const schema = gql`
  type Supplier {
    id: ID!
    name: String!
    address: String!
    phoneNumber: String!
    email: String
    licenseNumber: String!
    gstNumber: String!
    manufacturers: [Manufacturer!]
  }
`;

module.exports = schema;
