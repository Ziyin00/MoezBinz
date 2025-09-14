const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const PasswordResetToken = require('../models/PasswordResetToken');
const { sendPasswordResetEmail } = require('../services/emailService');

// Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({ 
        message: 'If an account with that email exists, we have sent a password reset link.' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Save reset token to database
    const passwordResetToken = new PasswordResetToken({
      userId: user._id,
      token: resetToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    });

    await passwordResetToken.save();

    // Send email
    const emailResult = await sendPasswordResetEmail(user.email, resetToken, user.name);
    
    if (!emailResult.success) {
      // If email fails, delete the token
      await PasswordResetToken.deleteOne({ token: resetToken });
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

    const resetToken = await PasswordResetToken.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() }
    }).populate('userId', 'name email');

    if (!resetToken) {
      return res.status(400).json({ 
        message: 'Invalid or expired reset token' 
      });
    }

    res.json({ 
      valid: true, 
      user: {
        name: resetToken.userId.name,
        email: resetToken.userId.email
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

    // Find valid reset token
    const resetToken = await PasswordResetToken.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() }
    }).populate('userId');

    if (!resetToken) {
      return res.status(400).json({ 
        message: 'Invalid or expired reset token' 
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user password
    await User.findByIdAndUpdate(resetToken.userId._id, {
      password: hashedPassword
    });

    // Mark token as used
    resetToken.used = true;
    await resetToken.save();

    res.json({ 
      message: 'Password has been reset successfully' 
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
