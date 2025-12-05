import { useState, useEffect } from "react";

import { Package, X } from "lucide-react";

export default function StockUpdateDialog({
  isOpen,
  onClose,
  onUpdate,
  product,
}) {
  const [q, setQ] = useState("");
  useEffect(() => {
    if (isOpen && product) setQ(product.stock.toString());
  }, [isOpen, product]);
  if (!isOpen) return null;
  const handleSubmit = () => {
    const qty = parseInt(q);
    if (!isNaN(qty) && qty >= 0) {
      onUpdate(qty);
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
        style={{ backdropFilter: "blur(4px)" }}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
          <Package className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Update Stock</h3>
        <p className="text-gray-600 mb-4">
          Update stock quantity for{" "}
          <span className="font-semibold">"{product?.name}"</span>
        </p>
        <input
          type="number"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          min="0"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-6"
          placeholder="Enter stock quantity"
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
