const { gql } = require('apollo-server-express');

const schema = gql`
  input ItemInput {
    product: ID!
    supplier: ID!
    totalStock: Int!
    quantityPerUnit: Int!
    purchasePrice: Float!
    sellingPrice: Float!
    totalPrice: Float!
    gst: Float!
    "Allowed formats are 07/2020, 07-2020 and Jul.2020"
    expiryDate: String!
    batchNo: String!
    details: String!
  }
`;

module.exports = schema;
