const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid');
const Product = require('../models/Product');
const User = require('../models/User');
const { verifyAccessToken } = require('../middleware/auth');

// Get all bids for a specific product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const bids = await Bid.find({ product: productId })
      .populate('bidder', 'name email')
      .populate('product', 'name imageUrl currentPrice')
      .sort({ bidTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Bid.countDocuments({ product: productId });

    res.json({
      bids,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching bids:', error);
    res.status(500).json({ message: 'Error fetching bids' });
  }
});

// Get all bids by a specific user
router.get('/user/:userId', verifyAccessToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Check if user is requesting their own bids or is admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const bids = await Bid.find({ bidder: userId })
      .populate('product', 'name imageUrl currentPrice endDate status')
      .sort({ bidTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Bid.countDocuments({ bidder: userId });

    res.json({
      bids,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching user bids:', error);
    res.status(500).json({ message: 'Error fetching user bids' });
  }
});

// Create a new bid
router.post('/', verifyAccessToken, async (req, res) => {
  try {
    const { productId, amount, isAutoBid = false, maxBidAmount } = req.body;
    const bidderId = req.user.id;

    // Validate input
    if (!productId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid bid data' });
    }

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.status !== 'active') {
      return res.status(400).json({ message: 'Product is not available for bidding' });
    }

    // Check if auction has ended
    if (new Date() > new Date(product.endDate)) {
      return res.status(400).json({ message: 'Auction has ended' });
    }

    // Check if bid amount is higher than current price
    if (amount <= product.currentPrice) {
      return res.status(400).json({ 
        message: `Bid must be higher than current price of $${product.currentPrice}` 
      });
    }

    // Check if user already has a bid on this product
    const existingBid = await Bid.findOne({ 
      product: productId, 
      bidder: bidderId,
      status: 'active'
    });

    if (existingBid) {
      return res.status(400).json({ 
        message: 'You already have an active bid on this product' 
      });
    }

    // Create new bid
    const bid = new Bid({
      product: productId,
      bidder: bidderId,
      amount,
      isAutoBid,
      maxBidAmount: isAutoBid ? maxBidAmount : undefined,
      status: 'active',
      bidTime: new Date()
    });

    await bid.save();

    // Update product current price
    product.currentPrice = amount;
    await product.save();

    // Populate the bid with user and product info
    await bid.populate('bidder', 'name email');
    await bid.populate('product', 'name imageUrl currentPrice');

    res.status(201).json({
      message: 'Bid placed successfully',
      bid
    });
  } catch (error) {
    console.error('Error creating bid:', error);
    res.status(500).json({ message: 'Error creating bid' });
  }
});

// Update a bid (for auto-bidding)
router.put('/:bidId', verifyAccessToken, async (req, res) => {
  try {
    const { bidId } = req.params;
    const { amount, maxBidAmount } = req.body;
    const userId = req.user.id;

    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Check if user owns this bid or is admin
    if (bid.bidder.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if bid is still active
    if (bid.status !== 'active') {
      return res.status(400).json({ message: 'Cannot update inactive bid' });
    }

    // Update bid
    if (amount !== undefined) bid.amount = amount;
    if (maxBidAmount !== undefined) bid.maxBidAmount = maxBidAmount;

    await bid.save();

    // Update product current price if this is the highest bid
    const product = await Product.findById(bid.product);
    if (product && amount > product.currentPrice) {
      product.currentPrice = amount;
      await product.save();
    }

    await bid.populate('bidder', 'name email');
    await bid.populate('product', 'name imageUrl currentPrice');

    res.json({
      message: 'Bid updated successfully',
      bid
    });
  } catch (error) {
    console.error('Error updating bid:', error);
    res.status(500).json({ message: 'Error updating bid' });
  }
});

// Cancel a bid
router.delete('/:bidId', verifyAccessToken, async (req, res) => {
  try {
    const { bidId } = req.params;
    const userId = req.user.id;

    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Check if user owns this bid or is admin
    if (bid.bidder.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if bid is still active
    if (bid.status !== 'active') {
      return res.status(400).json({ message: 'Cannot cancel inactive bid' });
    }

    // Mark bid as cancelled
    bid.status = 'cancelled';
    await bid.save();

    res.json({ message: 'Bid cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling bid:', error);
    res.status(500).json({ message: 'Error cancelling bid' });
  }
});

module.exports = router;
