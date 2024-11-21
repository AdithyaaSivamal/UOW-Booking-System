// controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');

// Register a new user
exports.register = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const newUser = new User({
      username,
      passwordHash: password,
      email,
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Login handler with optional MFA
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Handle MFA if enabled
    if (user.mfaSecret) {
      const tempToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '5m' });
      return res.status(200).json({ mfaRequired: true, tempToken });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin login with privilege check
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, isAdmin: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// MFA setup with QR code generation
exports.mfaSetup = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const secret = speakeasy.generateSecret({ length: 20 });
    user.mfaSecret = secret.base32;
    await user.save();

    const qrCodeUrl = `otpauth://totp/RoomBookingSystem:${user.email}?secret=${secret.base32}&issuer=RoomBookingSystem`;
    res.status(200).json({ qrCodeUrl, secret: secret.base32 });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// MFA verification and token generation
exports.mfaVerify = async (req, res) => {
  const { token } = req.body;
  const tempToken = req.headers['authorization']?.split(' ')[1];

  if (!tempToken) return res.status(401).json({ message: 'Authentication token required' });

  try {
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || !user.mfaSecret) return res.status(400).json({ message: 'MFA not set up for this user' });

    const verified = speakeasy.totp.verify({ secret: user.mfaSecret, encoding: 'base32', token });
    if (!verified) return res.status(400).json({ message: 'Invalid MFA token' });

    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token: authToken });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Logout (client should delete JWT on their side)
exports.logout = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};
