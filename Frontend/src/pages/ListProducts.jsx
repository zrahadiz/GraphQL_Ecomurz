import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { graphqlClient } from "@/utils/graphql/config";
import { MUTATIONS } from "@/utils/graphql/mutations";
import { QUERIES } from "@/utils/graphql/queries";

import ConfirmDialog from "@/components/ConfirmDialog";
import StockUpdateDialog from "@/components/StockUpdateDialog";

import {
  Package,
  Plus,
  Edit2,
  Search,
  Trash2,
  AlertCircle,
  RefreshCw,
  X,
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  Filter,
} from "lucide-react";
import { toast } from "../lib/toast";

function ListProducts() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    product: null,
  });

  const [stockDialog, setStockDialog] = useState({
    isOpen: false,
    product: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  useEffect(() => {
    console.log("cat 1: ", categoryFilter);
    console.log("cat 2: ", Boolean(categoryFilter));
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
    console.log("Deleting product with id:", id);

    setLoading(true);
    setError(null);
    try {
      await graphqlClient(MUTATIONS.DELETE_PRODUCT, { id });
      await fetchProducts();
      await fetchStats();
      setDeleteDialog({ isOpen: false, product: null });
      toast("Product deleted successfully!", {
        type: "success",
        position: "top-center",
      });
    } catch (err) {
      setError("Failed to delete product");
      console.error("Error deleting product:", err);
      toast("Failed to delete product", {
        type: "error",
        position: "top-center",
      });
    }
    setLoading(false);
  };

  const handleUpdateStock = async (id, newStock) => {
    console.log("Updating stock for product id:", id);
    console.log("Current stock:", newStock);

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

      toast("Stock updated successfully!", {
        type: "success",
        position: "top-center",
      });
    } catch (err) {
      setError("Failed to update stock");
      console.error("Error updating stock:", err);
      toast("Failed to update stock", {
        type: "error",
        position: "top-center",
      });
    }
    setLoading(false);
  };

  const cats = [...new Set(products.map((p) => p.category))];

  const fmt = (p) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(p);

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Product Inventory
          </h1>
          <p className="text-gray-600">
            Manage and track your products efficiently
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-1">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => {
              fetchProducts();
              fetchStats();
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-gray-300 hover:shadow-md transition-all cursor-pointer"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
          <button
            onClick={() => navigate("/add-product")}
            className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">
                    Total Products
                  </p>
                  <p className="text-4xl font-bold">{stats.totalProducts}</p>
                </div>

                <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-blue-100 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Value: {fmt(stats.totalValue)}</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Categories</h3>
              </div>
              <div className="space-y-3">
                {stats.categories.map((c, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-medium">
                      {c.category}
                    </span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-full">
                      {c.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Low Stock</h3>
              </div>
              <div className="space-y-3">
                {stats.lowStock.length === 0 ? (
                  <p className="text-sm text-gray-500">All sufficient ✓</p>
                ) : (
                  stats.lowStock.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-600 truncate flex-1 mr-2">
                        {p.name}
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                        {p.stock}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Search & Filter</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search products..."
                className="w-full pl-12 pr-24 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white cursor-pointer"
            >
              <option value="all">All Categories</option>
              {cats.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
            </div>
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
            <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? "Try adjusting search" : "Add your first product"}
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  fetchProducts();
                }}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700"
              >
                Clear
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-56 bg-linear-to-br from-blue-100 to-indigo-100 overflow-hidden group">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="w-20 h-20 text-gray-300" />
                    </div>
                  )}
                  {p.stock < 20 && (
                    <div className="absolute top-3 right-3">
                      <div className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Low Stock
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate(`/edit-product/${p.id}`)}
                      className="p-2 bg-white bg-opacity-90 text-blue-600 rounded-lg hover:bg-white shadow-lg cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteDialog({ isOpen: true, product: p })
                      }
                      className="p-2 bg-white bg-opacity-90 text-red-600 rounded-lg hover:bg-white shadow-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 flex-1 pr-2 line-clamp-1">
                      {p.name}
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full whitespace-nowrap">
                      {p.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 h-10 line-clamp-2">
                    {p.description}
                  </p>
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div className="text-2xl font-bold text-blue-600">
                      {fmt(p.price)}
                    </div>
                    <button
                      onClick={() =>
                        setStockDialog({ isOpen: true, product: p })
                      }
                      className="group flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Package className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600">
                        {p.stock}
                      </span>
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Added: {fmtDate(p.createdAt)}</div>
                    {p.updatedAt !== p.createdAt && (
                      <div>Updated: {fmtDate(p.updatedAt)}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, product: null })}
        onConfirm={async () => {
          handleDelete(deleteDialog.product.id);
        }}
        product={deleteDialog.product}
      />

      <StockUpdateDialog
        isOpen={stockDialog.isOpen}
        onClose={() => setStockDialog({ isOpen: false, product: null })}
        onUpdate={async (newStock) => {
          await handleUpdateStock(stockDialog.product.id, newStock);
        }}
        product={stockDialog.product}
      />
    </div>
  );
}

export default ListProducts;
