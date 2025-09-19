const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { sendPasswordResetEmail } = require('../services/emailService');

// Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const pool = req.app.locals.pool;

    // Check if user exists
    const userResult = await pool.query('SELECT id, username, email FROM users WHERE email = $1', [email.toLowerCase()]);
    
    if (userResult.rows.length === 0) {
      // Don't reveal if email exists or not for security
      return res.json({ 
        message: 'If an account with that email exists, we have sent a password reset link.' 
      });
    }

    const user = userResult.rows[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Save reset token to database
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    
    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at, used) VALUES ($1, $2, $3, $4)',
      [user.id, resetToken, expiresAt, false]
    );

    // Send email
    const emailResult = await sendPasswordResetEmail(user.email, resetToken, user.username);
    
    if (!emailResult.success) {
      // If email fails, delete the token
      await pool.query('DELETE FROM password_reset_tokens WHERE token = $1', [resetToken]);
      console.error('Email sending failed:', emailResult.error);
      return res.status(500).json({ 
        message: 'Failed to send reset email. Please try again later.' 
      });
    }

    res.json({ 
      message: 'If an account with that email exists, we have sent a password reset link.' 
    });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Verify reset token
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const pool = req.app.locals.pool;

    const tokenResult = await pool.query(`
      SELECT prt.*, u.username, u.email 
      FROM password_reset_tokens prt
      JOIN users u ON prt.user_id = u.id
      WHERE prt.token = $1 AND prt.used = false AND prt.expires_at > NOW()
    `, [token]);

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({ 
        message: 'Invalid or expired reset token' 
      });
    }

    const resetToken = tokenResult.rows[0];

    res.json({ 
      valid: true, 
      user: {
        name: resetToken.username,
        email: resetToken.email
      }
    });
  } catch (error) {
    console.error('Error verifying reset token:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        message: 'Token and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    const pool = req.app.locals.pool;

    // Find valid reset token
    const tokenResult = await pool.query(`
      SELECT prt.*, u.id as user_id
      FROM password_reset_tokens prt
      JOIN users u ON prt.user_id = u.id
      WHERE prt.token = $1 AND prt.used = false AND prt.expires_at > NOW()
    `, [token]);

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({ 
        message: 'Invalid or expired reset token' 
      });
    }

    const resetToken = tokenResult.rows[0];

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user password
    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, resetToken.user_id]
    );

    // Mark token as used
    await pool.query(
      'UPDATE password_reset_tokens SET used = true WHERE token = $1',
      [token]
    );

    res.json({ 
      message: 'Password has been reset successfully' 
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
