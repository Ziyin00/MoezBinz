const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('../middleware/adminAuth');

// Get all users (admin only)
router.get('/users', verifyAdminToken, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const result = await pool.query('SELECT id, username, email, role, is_verified, created_at FROM users ORDER BY created_at DESC');
    
    res.json({
      users: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard stats (admin only)
router.get('/stats', verifyAdminToken, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    
    // Get user count
    const userCountResult = await pool.query('SELECT COUNT(*) as count FROM users');
    const userCount = userCountResult.rows[0].count;
    
    // Get product count
    const productCountResult = await pool.query('SELECT COUNT(*) as count FROM products');
    const productCount = productCountResult.rows[0].count;
    
    // Get bid count
    const bidCountResult = await pool.query('SELECT COUNT(*) as count FROM bids');
    const bidCount = bidCountResult.rows[0].count;
    
    res.json({
      stats: {
        totalUsers: parseInt(userCount),
        totalProducts: parseInt(productCount),
        totalBids: parseInt(bidCount)
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role (admin only)
router.put('/users/:id/role', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const pool = req.app.locals.pool;
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, email, role',
      [role, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
