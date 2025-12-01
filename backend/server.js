const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart'); // Add this import
const orderRoutes = require('./routes/orders'); // Add this import

const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration - Allow frontend requests
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes); // Add this line
app.use('/api/orders', orderRoutes); // Add this line

// Test route to verify server is working
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend server is working!',
    timestamp: new Date().toISOString()
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: '🛍️ MERN Ecommerce API',
    version: '1.0.0',
    endpoints: {
      test: 'GET /api/test',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        test: 'GET /api/auth/test'
      },
      products: 'GET /api/products',
      cart: 'GET /api/cart', // Add this
      orders: 'GET /api/orders' // Add this
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    availableEndpoints: [ // Add available endpoints to help debugging
      'GET /',
      'GET /api/test',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/products',
      'GET /api/cart',
      'GET /api/orders'
    ]
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 CORS enabled for: http://localhost:5173`);
  console.log(`📚 Available endpoints:`);
  console.log(`   http://localhost:${PORT}/api/auth/register`);
  console.log(`   http://localhost:${PORT}/api/auth/login`);
  console.log(`   http://localhost:${PORT}/api/products`);
  console.log(`   http://localhost:${PORT}/api/cart`);
  console.log(`   http://localhost:${PORT}/api/orders`);
});