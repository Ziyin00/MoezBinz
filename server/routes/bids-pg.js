const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../middleware/auth');

// Get all bids for a specific product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const pool = req.app.locals.pool;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get bids with user and product info
    const result = await pool.query(`
      SELECT b.id, b.amount, b.status, b.created_at as bid_time,
             u.id as user_id, u.username, u.email,
             p.id as product_id, p.name as product_name, p.image_url, p.price as current_price
      FROM bids b
      JOIN users u ON b.user_id = u.id
      JOIN products p ON b.product_id = p.id
      WHERE b.product_id = $1
      ORDER BY b.created_at DESC
      LIMIT $2 OFFSET $3
    `, [productId, limit, offset]);

    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) as total FROM bids WHERE product_id = $1', [productId]);
    const total = parseInt(countResult.rows[0].total);

    const bids = result.rows.map(bid => ({
      _id: bid.id.toString(),
      amount: parseFloat(bid.amount),
      status: bid.status,
      bidTime: bid.bid_time,
      bidder: {
        _id: bid.user_id.toString(),
        name: bid.username,
        email: bid.email
      },
      product: {
        _id: bid.product_id.toString(),
        name: bid.product_name,
        imageUrl: bid.image_url,
        currentPrice: parseFloat(bid.current_price)
      }
    }));

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
    const pool = req.app.locals.pool;

    // Check if user is requesting their own bids or is admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await pool.query(`
      SELECT b.id, b.amount, b.status, b.created_at as bid_time,
             p.id as product_id, p.name as product_name, p.image_url, p.price as current_price, p.status as product_status
      FROM bids b
      JOIN products p ON b.product_id = p.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);

    const countResult = await pool.query('SELECT COUNT(*) as total FROM bids WHERE user_id = $1', [userId]);
    const total = parseInt(countResult.rows[0].total);

    const bids = result.rows.map(bid => ({
      _id: bid.id.toString(),
      amount: parseFloat(bid.amount),
      status: bid.status,
      bidTime: bid.bid_time,
      product: {
        _id: bid.product_id.toString(),
        name: bid.product_name,
        imageUrl: bid.image_url,
        currentPrice: parseFloat(bid.current_price),
        status: bid.product_status
      }
    }));

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
    const pool = req.app.locals.pool;

    // Validate input
    if (!productId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid bid data' });
    }

    // Check if product exists and is active
    const productResult = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);
    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = productResult.rows[0];
    if (product.status !== 'active') {
      return res.status(400).json({ message: 'Product is not available for bidding' });
    }

    // Note: Users can bid any amount they want - higher or lower than current price
    // This allows for flexible bidding strategies

    // Check if user already has a bid on this product
    const existingBidResult = await pool.query(
      'SELECT id FROM bids WHERE product_id = $1 AND user_id = $2 AND status = $3',
      [productId, bidderId, 'active']
    );

    if (existingBidResult.rows.length > 0) {
      return res.status(400).json({ 
        message: 'You already have an active bid on this product' 
      });
    }

    // Create new bid (product price remains unchanged - only admin can modify product prices)
    const bidResult = await pool.query(`
      INSERT INTO bids (product_id, user_id, amount, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, amount, status, created_at
    `, [productId, bidderId, amount, 'active']);

    const bid = bidResult.rows[0];

    // Get user and product info for response (without updating product price)
    const userResult = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [bidderId]);
    const productInfoResult = await pool.query('SELECT id, name, image_url, price FROM products WHERE id = $1', [productId]);

    const responseBid = {
      _id: bid.id.toString(),
      amount: parseFloat(bid.amount),
      status: bid.status,
      bidTime: bid.created_at,
      bidder: {
        _id: userResult.rows[0].id.toString(),
        name: userResult.rows[0].username,
        email: userResult.rows[0].email
      },
      product: {
        _id: productInfoResult.rows[0].id.toString(),
        name: productInfoResult.rows[0].name,
        imageUrl: productInfoResult.rows[0].image_url,
        currentPrice: parseFloat(productInfoResult.rows[0].price)
      }
    };

    res.status(201).json({
      message: 'Bid placed successfully',
      bid: responseBid
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
    const pool = req.app.locals.pool;

    const bidResult = await pool.query('SELECT * FROM bids WHERE id = $1', [bidId]);
    if (bidResult.rows.length === 0) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    const bid = bidResult.rows[0];

    // Check if user owns this bid or is admin
    if (bid.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if bid is still active
    if (bid.status !== 'active') {
      return res.status(400).json({ message: 'Cannot update inactive bid' });
    }

    // Update bid
    const updateFields = [];
    const updateValues = [];
    let paramCount = 0;

    if (amount !== undefined) {
      paramCount++;
      updateFields.push(`amount = $${paramCount}`);
      updateValues.push(amount);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    paramCount++;
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    paramCount++;
    updateValues.push(bidId);

    const updateQuery = `UPDATE bids SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const updatedBidResult = await pool.query(updateQuery, updateValues);
    const updatedBid = updatedBidResult.rows[0];

    // Note: Product price is not updated when bids are placed or updated
    // Only admin can change product prices through the admin panel
    // Bids are stored separately and don't affect the product's current price

    // Get user and product info for response
    const userResult = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [bid.user_id]);
    const productResult = await pool.query('SELECT id, name, image_url, price FROM products WHERE id = $1', [bid.product_id]);

    const responseBid = {
      _id: updatedBid.id.toString(),
      amount: parseFloat(updatedBid.amount),
      status: updatedBid.status,
      bidTime: updatedBid.created_at,
      bidder: {
        _id: userResult.rows[0].id.toString(),
        name: userResult.rows[0].username,
        email: userResult.rows[0].email
      },
      product: {
        _id: productResult.rows[0].id.toString(),
        name: productResult.rows[0].name,
        imageUrl: productResult.rows[0].image_url,
        currentPrice: parseFloat(productResult.rows[0].price)
      }
    };

    res.json({
      message: 'Bid updated successfully',
      bid: responseBid
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
    const pool = req.app.locals.pool;

    const bidResult = await pool.query('SELECT * FROM bids WHERE id = $1', [bidId]);
    if (bidResult.rows.length === 0) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    const bid = bidResult.rows[0];

    // Check if user owns this bid or is admin
    if (bid.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if bid is still active
    if (bid.status !== 'active') {
      return res.status(400).json({ message: 'Cannot cancel inactive bid' });
    }

    // Mark bid as cancelled
    await pool.query('UPDATE bids SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', 
      ['cancelled', bidId]);

    res.json({ message: 'Bid cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling bid:', error);
    res.status(500).json({ message: 'Error cancelling bid' });
  }
});

module.exports = router;
