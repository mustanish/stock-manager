const { gql } = require('apollo-server-express');

const schema = gql`
  type Query {
    profile(id: ID!): User!
    variants: [Variant!]!
    categories: [Category!]!
    products(name: String!): [Product!]!
    suppliers(name: String!): [Supplier!]!
    manufacturers(name: String!): [Manufacturer!]!
  }
`;

module.exports = schema;
