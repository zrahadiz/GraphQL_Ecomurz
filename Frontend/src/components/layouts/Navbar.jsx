import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Catalog Service
              </h1>
              <p className="text-sm text-gray-600">GraphQL Microservice Demo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
