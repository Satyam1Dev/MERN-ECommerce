import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

// Context
import { CartProvider } from './context/CartContext'

// Components
import Navigation from './components/common/Navigation'
import Footer from './components/common/Footer'

// Pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'

// Auth service for debugging
import { authService } from './services/authService'

// Debug component - remove this in production
const AuthDebug = () => {
  useEffect(() => {
    console.log('=== AUTH DEBUG ===');
    console.log('Is authenticated:', authService.isAuthenticated());
    console.log('Current user:', authService.getCurrentUser());
    console.log('Token in localStorage:', !!localStorage.getItem('token'));
    console.log('User in localStorage:', !!localStorage.getItem('user'));
    console.log('==================');
  }, []);

  return null;
};

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App d-flex flex-column min-vh-100">
          <AuthDebug /> {/* Add this debug component */}
          <Navigation />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  )
}

export default App