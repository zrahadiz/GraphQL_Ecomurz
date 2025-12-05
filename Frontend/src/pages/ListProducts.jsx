import { useState, useEffect } from "react";

import { graphqlClient } from "@/utils/graphql/config";
import { MUTATIONS } from "@/utils/graphql/mutations";
import { QUERIES } from "@/utils/graphql/queries";

import {
  Package,
  Plus,
  Edit2,
  Search,
  Trash2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function ListProducts() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  useEffect(() => {
    if (categoryFilter) {
      fetchProducts();
    }
  }, [categoryFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await graphqlClient(QUERIES.GET_PRODUCTS, {
        category: categoryFilter || undefined,
        limit: 50,
      });
      setProducts(result.data.products);
    } catch (err) {
      setError(
        "Failed to fetch products. Make sure backend is running on http://localhost:4000"
      );
      console.error("Error fetching products:", err);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const result = await graphqlClient(QUERIES.GET_PRODUCT_STATS);
      setStats(result.data.productStats);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchProducts();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await graphqlClient(QUERIES.SEARCH_PRODUCTS, {
        query: searchTerm,
      });
      setProducts(result.data.searchProducts);
    } catch (err) {
      setError("Failed to search products");
      console.error("Error searching:", err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await graphqlClient(MUTATIONS.DELETE_PRODUCT, { id });
      await fetchProducts();
      await fetchStats();
    } catch (err) {
      setError("Failed to delete product");
      console.error("Error deleting product:", err);
    }
    setLoading(false);
  };

  const handleUpdateStock = async (id, currentStock) => {
    const newStock = window.prompt(
      `Update stock for product (current: ${currentStock}):`,
      currentStock
    );

    if (newStock === null || newStock === "") return;

    const quantity = parseInt(newStock);
    if (isNaN(quantity) || quantity < 0) {
      setError("Invalid stock quantity");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await graphqlClient(MUTATIONS.UPDATE_STOCK, {
        id,
        quantity,
      });
      await fetchProducts();
      await fetchStats();
    } catch (err) {
      setError("Failed to update stock");
      console.error("Error updating stock:", err);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      imageUrl: "",
    });
    setSelectedProduct(null);
    setShowForm(false);
    setError(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => {
              fetchProducts();
              fetchStats();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
          <button
            onClick={() => {
              navigate("/add-product");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Statistics Section */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Total Products
                </h3>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">
                {stats.totalProducts}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Total Value: {formatPrice(stats.totalValue)}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Categories
              </h3>
              <div className="space-y-2">
                {stats.categories.map((cat, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {cat.category}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {cat.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Low Stock Alert
              </h3>
              <div className="space-y-2">
                {stats.lowStock.length === 0 ? (
                  <p className="text-sm text-gray-600">
                    All products have sufficient stock
                  </p>
                ) : (
                  stats.lowStock.map((product) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gray-600 truncate">
                        {product.name}
                      </span>
                      <span className="font-semibold text-red-600">
                        {product.stock}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Search
              </button>
            </div>

            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading && products.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? "Try adjusting your search"
                : "Start by adding your first product"}
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  fetchProducts();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`${
                      product.imageUrl ? "hidden" : "flex"
                    } w-full h-full items-center justify-center`}
                  >
                    <Package className="w-20 h-20 text-gray-400" />
                  </div>
                  {product.stock < 20 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Low Stock
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 flex-1">
                      {product.name}
                    </h3>
                    <div className="flex gap-1">
                      <button
                        onClick={() => navigate(`/edit-product/${product.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {product.category}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateStock(product.id, product.stock)
                      }
                      className="text-sm text-gray-600 hover:text-blue-600 font-semibold"
                      title="Click to update stock"
                    >
                      Stock: {product.stock}
                    </button>
                  </div>

                  <div className="flex items-center text-xl font-bold text-blue-600 mb-3">
                    {formatPrice(product.price)}
                  </div>

                  <div className="text-xs text-gray-500 border-t pt-2">
                    <div>Created: {formatDate(product.createdAt)}</div>
                    {product.updatedAt !== product.createdAt && (
                      <div>Updated: {formatDate(product.updatedAt)}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListProducts;
