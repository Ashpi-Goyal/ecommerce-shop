import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Register from "./Pages/Register";
import Home from "./Pages/Home.jsx";
import Products from "./Pages/Products.jsx";
import ProductDetails from "./Pages/ProductDetails.jsx";
import Cart from "./Pages/Cart.jsx";
import Checkout from "./Pages/Checkout.jsx";
import OrderSuccess from "./Pages/OrderSuccess.jsx";
import Login from "./Pages/Login.jsx";
import MyOrders from "./Pages/MyOrders.jsx";
import AdminProducts from "./Pages/AdminProducts.jsx";
import AddProduct from "./Pages/AddProduct.jsx";
import EditProduct from "./Pages/EditProduct.jsx";
import Footer from "./components/Footer.jsx";
import AdminOrders from "./Pages/AdminOrders.jsx";
import Categories from "./Pages/Categories.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import AdminPage from "./Pages/AdminPage.jsx";

function App() {
  return (
  <div className="app-layout"> 
    <BrowserRouter>

      {/* COMMON NAVBAR */}

      <Navbar />

      <main className="main-content">
        <Routes>

        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products/add"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products/edit/:id"
          element={
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/order-success/:orderId"
            element={<OrderSuccess />}
          />

          <Route 
          path="/register" 
          element={<Register />} 
          />

          <Route
          path="/login"
          element={<Login />}
          />

          <Route
          path="/my-orders"
          element={<MyOrders/>}
          />

          <Route
            path="/admin/products"
            element={<AdminProducts />}
          />

          <Route
            path="/admin/products/add"
            element={<AddProduct />}
          />

          <Route
          path="/admin/products/edit/:id"
          element = {<EditProduct/>}
          />

          <Route
            path="/admin/orders"
            element={<AdminOrders />}
          />

          <Route 
          path="/categories"
          element={<Categories/>}
          />

          <Route
            path="/adminpage"
            element={
                <AdminPage />
            }
          />

        </Routes>

      </main>

      <Footer/>

    </BrowserRouter>
  </div>
  );
}

export default App;