const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const productModel = require("./models/productModel");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    const app = express();

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Apollo Server
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      formatError: (error) => {
        console.error("GraphQL Error:", error);
        return error;
      },
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: "/graphql" });

    // Health check endpoint
    app.get("/health", (req, res) => {
      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        products: productModel.getAll().length,
      });
    });

    // REST API endpoint (optional)
    app.get("/api/products", (req, res) => {
      try {
        const products = productModel.getAll();
        res.json({
          success: true,
          data: products,
          count: products.length,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running`);
      console.log(
        `🔗 GraphQL: http://localhost:${PORT}${apolloServer.graphqlPath}`
      );
      console.log(`💚 Health: http://localhost:${PORT}/health`);
      console.log(`📦 REST API: http://localhost:${PORT}/api/products`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
}

startServer();

module.exports = { startServer };
