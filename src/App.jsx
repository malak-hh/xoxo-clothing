import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Storefront from "./pages/Storefront";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";             // ✅ NEW
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ NEW
import Footer from "./components/Footer";
import ProductPage from "./pages/ProductPage";

function App() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i._id === product._id && i.selectedSize === product.selectedSize
      );
      if (existing) {
        return prev.map((i) =>
          i._id === product._id && i.selectedSize === product.selectedSize
            ? { ...i, qty: (i.qty || 1) + (product.qty || 1) }
            : i
        );
      }
      return [...prev, { ...product, qty: product.qty || 1 }];
    });
  };

  const removeFromCart = (id, selectedSize) => {
    setCart((prev) => prev.filter((i) => !(i._id === id && i.selectedSize === selectedSize)));
  };

  const updateQty = (id, selectedSize, qty) => {
    if (qty < 1) return removeFromCart(id, selectedSize);
    setCart((prev) =>
      prev.map((i) =>
        i._id === id && i.selectedSize === selectedSize ? { ...i, qty } : i
      )
    );
  };

  const cartCount = cart.reduce((sum, i) => sum + (i.qty || 1), 0);

  const isAdminPage = window.location.pathname.startsWith("/admin");
  

  return (
    <Router>
      {!isAdminPage && (
        <Navbar cartCount={cartCount} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      )}

      <Routes>
        <Route path="/" element={<Storefront addToCart={addToCart} searchTerm={searchTerm} />} />
        <Route path="/category/:categoryName" element={<CategoryPage addToCart={addToCart} searchTerm={searchTerm} />} />
        <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} updateQty={updateQty} />} />
        <Route path="/product/:id" element={<ProductPage addToCart={addToCart} />} />

        {/*  Admin login — public */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin dashboard — protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!isAdminPage && <Footer />}
    </Router>
  );
}

export default App;
