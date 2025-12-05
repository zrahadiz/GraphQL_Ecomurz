const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const cors = require("cors");

let products = [
  {
    id: "1",
    name: "Laptop Gaming ROG",
    description: "High-performance gaming laptop with RTX 4070",
    price: 25000000,
    category: "Electronics",
    stock: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with Cherry MX switches",
    price: 1500000,
    category: "Electronics",
    stock: 50,
    imageUrl:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with precision sensor",
    price: 500000,
    category: "Electronics",
    stock: 100,
    imageUrl:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "USB-C Hub",
    description: "7-in-1 USB-C hub with HDMI and card reader",
    price: 350000,
    category: "Accessories",
    stock: 75,
    imageUrl:
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=300",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GraphQL Type Definitions
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

const resolvers = {
  Query: {
    products: (_, { category, limit, offset = 0 }) => {
      let filtered = products;

      if (category) {
        filtered = filtered.filter((p) => p.category === category);
      }

      if (limit) {
        filtered = filtered.slice(offset, offset + limit);
      }

      return filtered;
    },

    product: (_, { id }) => {
      return products.find((p) => p.id === id) || null;
    },

    productsByCategory: (_, { category }) => {
      return products.filter((p) => p.category === category);
    },

    searchProducts: (_, { query }) => {
      const lowerQuery = query.toLowerCase();
      return products.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery)
      );
    },

    productStats: () => {
      const totalProducts = products.length;
      const totalValue = products.reduce(
        (sum, p) => sum + p.price * p.stock,
        0
      );

      const categoryMap = new Map();
      products.forEach((p) => {
        if (!categoryMap.has(p.category)) {
          categoryMap.set(p.category, { count: 0, totalValue: 0 });
        }
        const stat = categoryMap.get(p.category);
        stat.count++;
        stat.totalValue += p.price * p.stock;
      });

      const categories = Array.from(categoryMap.entries()).map(
        ([category, stat]) => ({
          category,
          count: stat.count,
          totalValue: stat.totalValue,
        })
      );

      const lowStock = products.filter((p) => p.stock < 20);

      return {
        totalProducts,
        totalValue,
        categories,
        lowStock,
      };
    },
  },

  Mutation: {
    addProduct: (_, { input }) => {
      const newProduct = {
        id: String(products.length + 1),
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      products.push(newProduct);
      return newProduct;
    },

    updateProduct: (_, { id, input }) => {
      const index = products.findIndex((p) => p.id === id);

      if (index === -1) {
        throw new Error(`Product with ID ${id} not found`);
      }

      products[index] = {
        ...products[index],
        ...input,
        updatedAt: new Date().toISOString(),
      };

      return products[index];
    },

    deleteProduct: (_, { id }) => {
      const index = products.findIndex((p) => p.id === id);

      if (index === -1) {
        return false;
      }

      products.splice(index, 1);
      return true;
    },

    updateStock: (_, { id, quantity }) => {
      const product = products.find((p) => p.id === id);

      if (!product) {
        throw new Error(`Product with ID ${id} not found`);
      }

      product.stock = quantity;
      product.updatedAt = new Date().toISOString();

      return product;
    },

    bulkUpdateProducts: (_, { updates }) => {
      const updatedProducts = [];

      updates.forEach((update) => {
        const product = products.find((p) => p.id === update.id);
        if (product) {
          if (update.stock !== undefined) product.stock = update.stock;
          if (update.price !== undefined) product.price = update.price;
          product.updatedAt = new Date().toISOString();
          updatedProducts.push(product);
        }
      });

      return updatedProducts;
    },
  },
};

async function startServer() {
  const app = express();

  app.use(cors());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Add authentication/authorization logic here
      // const token = req.headers.authorization || '';
      return {};
    },
    formatError: (error) => {
      console.error("GraphQL Error:", error);
      return error;
    },
  });

  await server.start();

  server.applyMiddleware({ app, path: "/graphql" });

  app.get("/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      products: products.length,
    });
  });

  app.get("/api/products", (req, res) => {
    res.json(products);
  });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(
      `🚀 GraphQL Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `📊 GraphQL Playground: http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
  process.exit(1);
});

module.exports = { typeDefs, resolvers };
