const express = require('express');
const User = require('../models/User');
const Bid = require('../models/Bid');
const Product = require('../models/Product');
const verifyAdminAccess = require('../middleware/adminAuth');

const router = express.Router();

// Get all users (admin only)
router.get('/users', verifyAdminAccess, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      filter.role = role;
    }
    
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments(filter);
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role (admin only)
router.put('/users/:id/role', verifyAdminAccess, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be admin or user' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent admin from changing their own role
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }
    
    user.role = role;
    await user.save();
    
    res.json({ 
      message: 'User role updated successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user (admin only)
router.delete('/users/:id', verifyAdminAccess, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    // Delete user's bids
    await Bid.deleteMany({ bidder: req.params.id });
    
    // Delete user's products
    await Product.deleteMany({ createdBy: req.params.id });
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard statistics (admin only)
router.get('/stats', verifyAdminAccess, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalBids = await Bid.countDocuments();
    const activeProducts = await Product.countDocuments({ status: 'active' });
    const soldProducts = await Product.countDocuments({ status: 'sold' });
    
    // Get recent users
    const recentUsers = await User.find()
      .select('name email createdAt role')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get top products by bid count
    const topProducts = await Product.aggregate([
      {
        $lookup: {
          from: 'bids',
          localField: '_id',
          foreignField: 'product',
          as: 'bids'
        }
      },
      {
        $addFields: {
          bidCount: { $size: '$bids' }
        }
      },
      {
        $sort: { bidCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          name: 1,
          currentPrice: 1,
          bidCount: 1,
          status: 1,
          imageUrl: 1
        }
      }
    ]);
    
    res.json({
      totalUsers,
      totalProducts,
      totalBids,
      activeProducts,
      soldProducts,
      recentUsers,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all bids (admin only)
router.get('/bids', verifyAdminAccess, async (req, res) => {
  try {
    const { page = 1, limit = 10, productId } = req.query;
    const filter = {};
    
    if (productId) {
      filter.product = productId;
    }
    
    const bids = await Bid.find(filter)
      .populate('bidder', 'name email')
      .populate('product', 'name currentPrice')
      .sort({ bidTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Bid.countDocuments(filter);
    
    res.json({
      bids,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
