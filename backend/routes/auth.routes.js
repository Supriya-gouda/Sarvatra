const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// POST /api/auth/login - Role-based login (Demo)
router.post('/login', async (req, res) => {
  try {
    const { email, password, role, accessCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Authority login - requires access code
    if (role === 'authority') {
      if (!accessCode) {
        return res.status(400).json({ error: 'Access code required for authority login' });
      }

      // Demo authority credentials
      if (
        (email === 'admin@authority.gov' && password === 'admin123' && accessCode === 'AUTH2024') ||
        (email === 'email@ndma.gov.in' && password === 'password123' && accessCode === 'AUTH2024')
      ) {
        const token = jwt.sign(
          { 
            id: 'auth-001',
            email,
            role: 'authority'
          },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );

        return res.json({
          token,
          expiresIn: 86400,
          user: {
            id: 'auth-001',
            email,
            name: 'Authority Officer',
            role: 'authority',
            agency: 'NDMA'
          },
          message: 'Authority login successful'
        });
      }

      return res.status(401).json({ error: 'Invalid authority credentials or access code' });
    }

    // Citizen login
    // Demo citizen credentials
    if (email === 'demo@citizen.com' && password === 'demo123') {
      const token = jwt.sign(
        { 
          id: 'citizen-001',
          email,
          role: 'citizen'
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        expiresIn: 86400,
        user: {
          id: 'citizen-001',
          email,
          name: 'Demo Citizen',
          role: 'citizen'
        },
        message: 'Citizen login successful'
      });
    }

    // For any other email/password, allow citizen login (demo mode)
    const token = jwt.sign(
      { 
        id: 'citizen-' + Date.now(),
        email,
        role: 'citizen'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return res.json({
      token,
      expiresIn: 86400,
      user: {
        id: 'citizen-' + Date.now(),
        email,
        name: email.split('@')[0],
        role: 'citizen'
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Error in POST /api/auth/login:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/register - Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role = 'citizen' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // In production, save to database and hash password
    // For demo, just create a token
    const token = jwt.sign(
      { 
        id: role + '-' + Date.now(),
        email,
        role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      expiresIn: 86400,
      user: {
        id: role + '-' + Date.now(),
        email,
        name,
        role
      },
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Error in POST /api/auth/register:', error);
    res.status(500).json({ error: error.message });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// GET /api/auth/verify - Verify token
router.get('/verify', verifyToken, (req, res) => {
  res.json({
    valid: true,
    user: req.user
  });
});

module.exports = router;
module.exports.verifyToken = verifyToken;
