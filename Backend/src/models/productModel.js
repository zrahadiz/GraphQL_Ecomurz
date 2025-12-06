const productsData = require("../data/products.json");
const dotenv = require("dotenv");
dotenv.config();

const LOW_STOCK_THRESHOLD = parseInt(process.env.LOW_STOCK_THRESHOLD);

class ProductModel {
  constructor() {
    this.products = [...productsData];
    this.currentId = this.products.length;
  }

  getAll({ category, limit, offset = 0 } = {}) {
    let filtered = [...this.products];

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (limit) {
      filtered = filtered.slice(offset, offset + limit);
    }

    return filtered;
  }

  getById(id) {
    return this.products.find((p) => p.id === id) || null;
  }

  getByCategory(category) {
    return this.products.filter((p) => p.category === category);
  }

  search(query) {
    const lowerQuery = query.toLowerCase();
    return this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
    );
  }

  getStats() {
    const totalProducts = this.products.length;

    const totalValue = this.products.reduce(
      (sum, p) => sum + p.price * p.stock,
      0
    );

    const categoryMap = new Map();
    this.products.forEach((p) => {
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

    const lowStock = this.products.filter((p) => p.stock < LOW_STOCK_THRESHOLD);

    return {
      totalProducts,
      totalValue,
      categories,
      lowStock,
    };
  }

  create(input) {
    this.currentId++;
    const newProduct = {
      id: String(this.currentId),
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.products.push(newProduct);
    return newProduct;
  }

  update(id, input) {
    const index = this.products.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }

    this.products[index] = {
      ...this.products[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    return this.products[index];
  }

  delete(id) {
    const index = this.products.findIndex((p) => p.id === id);

    if (index === -1) {
      return false;
    }

    this.products.splice(index, 1);
    return true;
  }

  updateStock(id, quantity) {
    const product = this.getById(id);

    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }

    product.stock = quantity;
    product.updatedAt = new Date().toISOString();

    return product;
  }

  bulkUpdate(updates) {
    const updatedProducts = [];

    updates.forEach((update) => {
      const product = this.getById(update.id);
      if (product) {
        if (update.stock !== undefined) product.stock = update.stock;
        if (update.price !== undefined) product.price = update.price;
        product.updatedAt = new Date().toISOString();
        updatedProducts.push(product);
      }
    });

    return updatedProducts;
  }
}
const productModel = new ProductModel();

module.exports = productModel;
