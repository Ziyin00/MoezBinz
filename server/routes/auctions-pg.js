const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/auctions');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'auction-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// GET /api/auctions - Get all auctions (public)
router.get('/', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const { status, category, page = 1, limit = 10 } = req.query;
    
    let query = `
      SELECT a.*, u.username as created_by_name,
             (SELECT COUNT(*) FROM auction_bids ab WHERE ab.auction_id = a.id) as bid_count,
             (SELECT MAX(ab.bid_amount) FROM auction_bids ab WHERE ab.auction_id = a.id) as highest_bid
      FROM auctions a
      LEFT JOIN users u ON a.created_by = u.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 0;
    
    if (status) {
      paramCount++;
      query += ` AND a.status = $${paramCount}`;
      params.push(status);
    }
    
    if (category) {
      paramCount++;
      query += ` AND a.category = $${paramCount}`;
      params.push(category);
    }
    
    query += ` ORDER BY a.created_at DESC`;
    
    // Add pagination
    const offset = (page - 1) * limit;
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(parseInt(limit));
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);
    
    const result = await pool.query(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM auctions WHERE 1=1';
    const countParams = [];
    let countParamCount = 0;
    
    if (status) {
      countParamCount++;
      countQuery += ` AND status = $${countParamCount}`;
      countParams.push(status);
    }
    
    if (category) {
      countParamCount++;
      countQuery += ` AND category = $${countParamCount}`;
      countParams.push(category);
    }
    
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);
    
    res.json({
      auctions: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching auctions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/auctions/:id - Get single auction
router.get('/:id', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const { id } = req.params;
    
    const auctionResult = await pool.query(`
      SELECT a.*, u.username as created_by_name,
             (SELECT COUNT(*) FROM auction_bids ab WHERE ab.auction_id = a.id) as bid_count
      FROM auctions a
      LEFT JOIN users u ON a.created_by = u.id
      WHERE a.id = $1
    `, [id]);
    
    if (auctionResult.rows.length === 0) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    
    const auction = auctionResult.rows[0];
    
    // Get recent bids
    const bidsResult = await pool.query(`
      SELECT ab.*, u.username, u.email
      FROM auction_bids ab
      JOIN users u ON ab.user_id = u.id
      WHERE ab.auction_id = $1
      ORDER BY ab.bid_amount DESC, ab.bid_time DESC
      LIMIT 10
    `, [id]);
    
    auction.recent_bids = bidsResult.rows;
    
    res.json(auction);
  } catch (error) {
    console.error('Error fetching auction:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/auctions - Create new auction (admin only)
router.post('/', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const {
      title,
      description,
      category,
      starting_price,
      reserve_price,
      bid_increment,
      start_time,
      end_time
    } = req.body;
    
    if (!title || !starting_price || !start_time || !end_time) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const imageUrl = req.file ? `/uploads/auctions/${req.file.filename}` : null;
    
    const result = await pool.query(`
      INSERT INTO auctions (
        title, description, image_url, category, starting_price, current_price,
        reserve_price, bid_increment, start_time, end_time, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      title,
      description,
      imageUrl,
      category,
      parseFloat(starting_price),
      parseFloat(starting_price), // current_price starts same as starting_price
      reserve_price ? parseFloat(reserve_price) : null,
      bid_increment ? parseFloat(bid_increment) : 1.00,
      new Date(start_time),
      new Date(end_time),
      req.user.id
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating auction:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/auctions/:id - Update auction (admin only)
router.put('/:id', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const { id } = req.params;
    const {
      title,
      description,
      category,
      starting_price,
      reserve_price,
      bid_increment,
      start_time,
      end_time,
      status
    } = req.body;
    
    // Check if auction exists
    const existingAuction = await pool.query('SELECT * FROM auctions WHERE id = $1', [id]);
    if (existingAuction.rows.length === 0) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    
    let imageUrl = existingAuction.rows[0].image_url;
    if (req.file) {
      // Delete old image if exists
      if (imageUrl) {
        const oldImagePath = path.join(__dirname, '..', imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imageUrl = `/uploads/auctions/${req.file.filename}`;
    }
    
    const result = await pool.query(`
      UPDATE auctions SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        image_url = COALESCE($3, image_url),
        category = COALESCE($4, category),
        starting_price = COALESCE($5, starting_price),
        reserve_price = COALESCE($6, reserve_price),
        bid_increment = COALESCE($7, bid_increment),
        start_time = COALESCE($8, start_time),
        end_time = COALESCE($9, end_time),
        status = COALESCE($10, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING *
    `, [
      title,
      description,
      imageUrl,
      category,
      starting_price ? parseFloat(starting_price) : null,
      reserve_price ? parseFloat(reserve_price) : null,
      bid_increment ? parseFloat(bid_increment) : null,
      start_time ? new Date(start_time) : null,
      end_time ? new Date(end_time) : null,
      status,
      id
    ]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating auction:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/auctions/:id - Delete auction (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const { id } = req.params;
    
    // Check if auction exists
    const existingAuction = await pool.query('SELECT * FROM auctions WHERE id = $1', [id]);
    if (existingAuction.rows.length === 0) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    
    // Delete image file if exists
    if (existingAuction.rows[0].image_url) {
      const imagePath = path.join(__dirname, '..', existingAuction.rows[0].image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete auction (cascade will delete bids and notifications)
    await pool.query('DELETE FROM auctions WHERE id = $1', [id]);
    
    res.json({ message: 'Auction deleted successfully' });
  } catch (error) {
    console.error('Error deleting auction:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/auctions/:id/bids - Get auction bids (admin only)
router.get('/:id/bids', requireAdmin, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT ab.*, u.username, u.email
      FROM auction_bids ab
      JOIN users u ON ab.user_id = u.id
      WHERE ab.auction_id = $1
      ORDER BY ab.bid_amount DESC, ab.bid_time DESC
    `, [id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching auction bids:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/auctions/:id/approve-winner - Approve auction winner (admin only)
router.post('/:id/approve-winner', requireAdmin, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const { id } = req.params;
    const { winner_id, winning_bid } = req.body;
    
    if (!winner_id || !winning_bid) {
      return res.status(400).json({ message: 'Winner ID and winning bid amount are required' });
    }
    
    // Update auction with winner
    const result = await pool.query(`
      UPDATE auctions SET
        winner_id = $1,
        winning_bid = $2,
        status = 'completed',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [winner_id, parseFloat(winning_bid), id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    
    // Mark the winning bid
    await pool.query(`
      UPDATE auction_bids SET is_winning_bid = true
      WHERE auction_id = $1 AND user_id = $2 AND bid_amount = $3
    `, [id, winner_id, parseFloat(winning_bid)]);
    
    // Create notification for winner
    await pool.query(`
      INSERT INTO auction_notifications (user_id, auction_id, type, title, message)
      VALUES ($1, $2, 'auction_won', 'You Won the Auction!', 'Congratulations! You won the auction for $3. Please proceed to payment.')
    `, [winner_id, id, result.rows[0].title]);
    
    res.json({ message: 'Auction winner approved successfully', auction: result.rows[0] });
  } catch (error) {
    console.error('Error approving auction winner:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
