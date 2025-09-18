const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { signAccessToken, signRefreshToken } = require('../utils/token');

const COOKIE_NAME = 'refreshToken';

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const pool = req.app.locals.pool;
    
    // Check if user exists
    const existsResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existsResult.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Create user
    const userResult = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, role',
      [name, email, hashed]
    );
    
    const user = userResult.rows[0];
    const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id, email: user.email, role: user.role });

    // Set HttpOnly cookie for refresh token
    res.cookie(COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    res.json({
      user: { id: user.id, name: user.username, email: user.email, role: user.role },
      accessToken
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const pool = req.app.locals.pool;
    
    // Find user
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];
    
    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id, email: user.email, role: user.role });

    res.cookie(COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.json({
      user: { id: user.id, name: user.username, email: user.email, role: user.role },
      accessToken
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// REFRESH
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }
      const accessToken = signAccessToken({ id: payload.id, email: payload.email, role: payload.role });
      // optionally rotate refresh token:
      const newRefresh = signRefreshToken({ id: payload.id, email: payload.email, role: payload.role });
      res.cookie(COOKIE_NAME, newRefresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      res.json({ accessToken });
    });
  } catch (err) {
    console.error('Refresh error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax' });
  res.json({ message: 'Logged out' });
});

module.exports = router;
