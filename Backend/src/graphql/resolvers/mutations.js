const productModel = require("../../models/productModel");

const mutations = {
  addProduct: (_, { input }) => {
    return productModel.create(input);
  },

  updateProduct: (_, { id, input }) => {
    return productModel.update(id, input);
  },

  deleteProduct: (_, { id }) => {
    return productModel.delete(id);
  },

  updateStock: (_, { id, quantity }) => {
    return productModel.updateStock(id, quantity);
  },
};

module.exports = mutations;
