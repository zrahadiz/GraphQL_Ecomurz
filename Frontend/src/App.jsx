import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import EditProduct from "@/pages/EditProduct";
import ListProducts from "@/pages/ListProducts";
import AppLayout from "@/components/layouts/AppLayout";
import AddProduct from "./pages/AddProduct";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/list-products"
            element={
              <AppLayout>
                <ListProducts />
              </AppLayout>
            }
          />

          <Route
            path="/add-product"
            element={
              <AppLayout>
                <AddProduct />
              </AppLayout>
            }
          />

          <Route
            path="/edit-product/:id"
            element={
              <AppLayout>
                <EditProduct />
              </AppLayout>
            }
          />

          <Route path="*" element={<Navigate to="/list-products" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
