const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../middleware/auth');
const { verifyAdminToken } = require('../middleware/adminAuth');

// Use the existing authentication middleware
const requireAuth = verifyAccessToken;

// POST /api/auction-bids - Place a bid
router.post('/', requireAuth, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const { auction_id, bid_amount, auto_bid_max } = req.body;
    const user_id = req.user.id;
    
    if (!auction_id || !bid_amount) {
      return res.status(400).json({ message: 'Auction ID and bid amount are required' });
    }
    
    // Check if auction exists and is active
    const auctionResult = await pool.query(`
      SELECT * FROM auctions 
      WHERE id = $1 AND status = 'active' AND end_time > NOW()
    `, [auction_id]);
    
    if (auctionResult.rows.length === 0) {
      return res.status(400).json({ message: 'Auction not found or not active' });
    }
    
    const auction = auctionResult.rows[0];
    
    // Check if bid amount is valid
    const minBid = Math.max(auction.current_price + auction.bid_increment, auction.starting_price);
    if (parseFloat(bid_amount) < minBid) {
      return res.status(400).json({ 
        message: `Minimum bid amount is $${minBid.toFixed(2)}` 
      });
    }
    
    // Check if user is not the current highest bidder
    const currentHighestBid = await pool.query(`
      SELECT user_id FROM auction_bids 
      WHERE auction_id = $1 AND is_winning_bid = true
      ORDER BY bid_amount DESC, bid_time DESC
      LIMIT 1
    `, [auction_id]);
    
    if (currentHighestBid.rows.length > 0 && currentHighestBid.rows[0].user_id === user_id) {
      return res.status(400).json({ message: 'You are already the highest bidder' });
    }
    
    // Start transaction
    await pool.query('BEGIN');
    
    try {
      // Insert the new bid
      const bidResult = await pool.query(`
        INSERT INTO auction_bids (auction_id, user_id, bid_amount, auto_bid_max)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [auction_id, user_id, parseFloat(bid_amount), auto_bid_max ? parseFloat(auto_bid_max) : null]);
      
      // Update auction current price
      await pool.query(`
        UPDATE auctions SET 
          current_price = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `, [parseFloat(bid_amount), auction_id]);
      
      // Mark all previous bids as not winning
      await pool.query(`
        UPDATE auction_bids SET is_winning_bid = false
        WHERE auction_id = $1
      `, [auction_id]);
      
      // Mark the new bid as winning
      await pool.query(`
        UPDATE auction_bids SET is_winning_bid = true
        WHERE id = $1
      `, [bidResult.rows[0].id]);
      
      // Notify previous highest bidder if they were outbid
      if (currentHighestBid.rows.length > 0 && currentHighestBid.rows[0].user_id !== user_id) {
        await pool.query(`
          INSERT INTO auction_notifications (user_id, auction_id, type, title, message)
          VALUES ($1, $2, 'outbid', 'You Were Outbid', 'Someone placed a higher bid on the auction you were watching.')
        `, [currentHighestBid.rows[0].user_id, auction_id]);
      }
      
      await pool.query('COMMIT');
      
      res.status(201).json({
        message: 'Bid placed successfully',
        bid: bidResult.rows[0],
        new_current_price: parseFloat(bid_amount)
      });
      
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
    
  } catch (error) {
    console.error('Error placing bid:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/auction-bids/user/:userId - Get user's bids (admin only)
router.get('/user/:userId', verifyAdminToken, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const { userId } = req.params;
    
    const result = await pool.query(`
      SELECT ab.*, a.title as auction_title, a.image_url, a.end_time, a.status as auction_status
      FROM auction_bids ab
      JOIN auctions a ON ab.auction_id = a.id
      WHERE ab.user_id = $1
      ORDER BY ab.bid_time DESC
    `, [userId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user bids:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/auction-bids/auction/:auctionId - Get auction bids (public)
router.get('/auction/:auctionId', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const { auctionId } = req.params;
    
    const result = await pool.query(`
      SELECT ab.bid_amount, ab.bid_time, ab.is_winning_bid,
             CASE 
               WHEN ab.is_winning_bid THEN 'Winning Bid'
               ELSE u.username
             END as bidder_name
      FROM auction_bids ab
      JOIN users u ON ab.user_id = u.id
      WHERE ab.auction_id = $1
      ORDER BY ab.bid_amount DESC, ab.bid_time DESC
      LIMIT 20
    `, [auctionId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching auction bids:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/auction-bids/my-bids - Get current user's bids
router.get('/my-bids', requireAuth, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const user_id = req.user.id;
    
    const result = await pool.query(`
      SELECT ab.*, a.title as auction_title, a.image_url, a.end_time, a.status as auction_status,
             a.current_price, a.winner_id
      FROM auction_bids ab
      JOIN auctions a ON ab.auction_id = a.id
      WHERE ab.user_id = $1
      ORDER BY ab.bid_time DESC
    `, [user_id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user bids:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/auction-bids/:id - Cancel a bid (only if auction hasn't ended)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const { id } = req.params;
    const user_id = req.user.id;
    
    // Check if bid exists and belongs to user
    const bidResult = await pool.query(`
      SELECT ab.*, a.end_time, a.status
      FROM auction_bids ab
      JOIN auctions a ON ab.auction_id = a.id
      WHERE ab.id = $1 AND ab.user_id = $2
    `, [id, user_id]);
    
    if (bidResult.rows.length === 0) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    const bid = bidResult.rows[0];
    
    // Check if auction has ended
    if (new Date() > new Date(bid.end_time) || bid.status !== 'active') {
      return res.status(400).json({ message: 'Cannot cancel bid on ended auction' });
    }
    
    // Check if this is the winning bid
    if (bid.is_winning_bid) {
      return res.status(400).json({ message: 'Cannot cancel winning bid' });
    }
    
    // Delete the bid
    await pool.query('DELETE FROM auction_bids WHERE id = $1', [id]);
    
    res.json({ message: 'Bid cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling bid:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/auction-bids/auction/:auctionId/current-bidder - Get current highest bidder info
router.get('/auction/:auctionId/current-bidder', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const { auctionId } = req.params;
    
    const result = await pool.query(`
      SELECT ab.bid_amount, ab.bid_time, u.username
      FROM auction_bids ab
      JOIN users u ON ab.user_id = u.id
      WHERE ab.auction_id = $1 AND ab.is_winning_bid = true
      ORDER BY ab.bid_amount DESC, ab.bid_time DESC
      LIMIT 1
    `, [auctionId]);
    
    if (result.rows.length === 0) {
      return res.json({ message: 'No bids yet' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching current bidder:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
