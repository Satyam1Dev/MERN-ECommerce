const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Register request received:', req.body);
    
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide name, email, and password' 
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    console.log('✅ User created successfully:', user.email);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(400).json({ 
      message: error.message || 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Login request received:', req.body);
    
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    
    if (user && (await user.comparePassword(password))) {
      console.log('✅ Login successful:', user.email);
      
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      console.log('❌ Login failed: Invalid credentials for', email);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(400).json({ 
      message: error.message || 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// Test route to check if auth routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working!' });
});

module.exports = router;