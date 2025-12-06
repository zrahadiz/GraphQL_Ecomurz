const { gql } = require("apollo-server");

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    category: String!
    stock: Int!
    imageUrl: String
    createdAt: String!
    updatedAt: String!
  }

  input ProductInput {
    name: String!
    description: String!
    price: Float!
    category: String!
    stock: Int!
    imageUrl: String
  }

  input UpdateProductInput {
    name: String
    description: String
    price: Float
    category: String
    stock: Int
    imageUrl: String
  }

  type Query {
    products(category: String, limit: Int, offset: Int): [Product!]!

    product(id: ID!): Product

    productsByCategory(category: String!): [Product!]!

    searchProducts(query: String!): [Product!]!

    productStats: ProductStats!
  }

  type ProductStats {
    totalProducts: Int!
    totalValue: Float!
    categories: [CategoryStat!]!
    lowStock: [Product!]!
  }

  type CategoryStat {
    category: String!
    count: Int!
    totalValue: Float!
  }

  type Mutation {
    addProduct(input: ProductInput!): Product!

    updateProduct(id: ID!, input: UpdateProductInput!): Product!

    deleteProduct(id: ID!): Boolean!

    updateStock(id: ID!, quantity: Int!): Product!
  }
`;

module.exports = typeDefs;
