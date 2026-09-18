const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { requireAdmin, JWT_SECRET } = require('../middleware/auth');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'srijeyam@admin2026';

// Admin Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Check credentials
  if (username.trim() === ADMIN_USERNAME && password.trim() === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { username: ADMIN_USERNAME, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Admin login successful',
      token,
      user: {
        username: ADMIN_USERNAME,
        role: 'admin',
        shop: 'SRI JEYAM CRACKERS'
      }
    });
  }

  return res.status(401).json({ error: 'Invalid admin username or password' });
});

// Admin Session Check
router.get('/me', requireAdmin, (req, res) => {
  res.json({
    authenticated: true,
    user: req.admin
  });
});

module.exports = router;
