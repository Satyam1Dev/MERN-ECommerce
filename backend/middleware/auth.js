const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token decoded:', decoded);
      
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        console.log('❌ User not found');
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      
      console.log('👤 User authenticated:', req.user.email);
      next();
    } catch (error) {
      console.log('❌ Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } catch (error) {
    console.log('❌ Auth middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

module.exports = { protect, admin };