const express = require("express");
const cors = require("cors");
const productModel = require("../models/productModel");

const createExpressApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

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

  return app;
};

module.exports = createExpressApp;
