const productModel = require("../../models/productModel");

const queries = {
  products: (_, args) => {
    return productModel.getAll(args);
  },

  product: (_, { id }) => {
    return productModel.getById(id);
  },

  productsByCategory: (_, { category }) => {
    return productModel.getByCategory(category);
  },

  searchProducts: (_, { query }) => {
    return productModel.search(query);
  },

  productStats: () => {
    return productModel.getStats();
  },
};

module.exports = queries;
