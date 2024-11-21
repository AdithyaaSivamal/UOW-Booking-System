// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/mfa/verify', authController.mfaVerify);
router.post('/admin-login', authController.adminLogin);

// Protected routes
router.post('/mfa/setup', authMiddleware, authController.mfaSetup);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;

