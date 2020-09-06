const { gql } = require('apollo-server-express');

const schema = gql`
  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    forgot(email: String!): Forgot!
    verify(email: String!, otp: String!): Verify!
    reset(password: String!, confirmPassword: String!): Message!
    refresh(id: ID!): Token!
    logout(id: ID!): Message!
    addProduct(input: ProductInput!): Message!
    addSupplier(input: SupplierInput!): Message!
    addManufacturer(name: String!): Message!
    addBillItem(input: ItemInput): Message!
  }
`;

module.exports = schema;
