const { gql } = require("apollo-server-express");

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
    # Get all products with optional filtering
    products(category: String, limit: Int, offset: Int): [Product!]!

    # Get single product by ID
    product(id: ID!): Product

    # Get products by category
    productsByCategory(category: String!): [Product!]!

    # Search products by name or description
    searchProducts(query: String!): [Product!]!

    # Get product statistics
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
    # Add new product
    addProduct(input: ProductInput!): Product!

    # Update existing product
    updateProduct(id: ID!, input: UpdateProductInput!): Product!

    # Delete product
    deleteProduct(id: ID!): Boolean!

    # Update stock quantity
    updateStock(id: ID!, quantity: Int!): Product!

    # Bulk update products
    bulkUpdateProducts(updates: [BulkProductUpdate!]!): [Product!]!
  }

  input BulkProductUpdate {
    id: ID!
    stock: Int
    price: Float
  }
`;

module.exports = typeDefs;
