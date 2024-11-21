// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication Middleware
exports.authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; 
  if (!token) return res.status(401).json({ message: 'Authentication token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded; // Attach user info to request object
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid authentication token' });
  }
};

// Admin Authorization Middleware
exports.adminMiddleware = (req, res, next) => {
  User.findById(req.user.userId)
    .then(user => {
      if (!user) return res.status(404).json({ message: 'User not found' });
      if (user.isAdmin) {
        next(); // Proceed if user is admin
      } else {
        res.status(403).json({ message: 'Admin privileges required' });
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Server error' });
    });
};
