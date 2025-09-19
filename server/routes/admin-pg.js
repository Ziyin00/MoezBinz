const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { verifyAdminToken } = require('../middleware/adminAuth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Configure multer for news uploads
const newsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/news/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'news-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const newsUpload = multer({ 
  storage: newsStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Get all users (admin only)
router.get('/users', verifyAdminToken, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    
    let query = 'SELECT id, username, email, role, is_verified, created_at FROM users WHERE 1=1';
    const params = [];
    let paramCount = 0;
    
    if (search) {
      paramCount++;
      query += ` AND (username ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }
    
    if (role) {
      paramCount++;
      query += ` AND role = $${paramCount}`;
      params.push(role);
    }
    
    query += ' ORDER BY created_at DESC';
    
    // Add pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(parseInt(limit));
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);
    
    const result = await pool.query(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const countParams = [];
    let countParamCount = 0;
    
    if (search) {
      countParamCount++;
      countQuery += ` AND (username ILIKE $${countParamCount} OR email ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }
    
    if (role) {
      countParamCount++;
      countQuery += ` AND role = $${countParamCount}`;
      countParams.push(role);
    }
    
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);
    
    const users = result.rows.map(user => ({
      _id: user.id.toString(),
      name: user.username,
      email: user.email,
      role: user.role,
      isVerified: user.is_verified,
      createdAt: user.created_at
    }));
    
    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
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
    const totalUsers = parseInt(userCountResult.rows[0].count);
    
    // Get product counts
    const productCountResult = await pool.query('SELECT COUNT(*) as count FROM products');
    const totalProducts = parseInt(productCountResult.rows[0].count);
    
    const activeProductsResult = await pool.query('SELECT COUNT(*) as count FROM products WHERE status = $1', ['active']);
    const activeProducts = parseInt(activeProductsResult.rows[0].count);
    
    const soldProductsResult = await pool.query('SELECT COUNT(*) as count FROM products WHERE status = $1', ['sold']);
    const soldProducts = parseInt(soldProductsResult.rows[0].count);
    
    // Get bid count
    const bidCountResult = await pool.query('SELECT COUNT(*) as count FROM bids');
    const totalBids = parseInt(bidCountResult.rows[0].count);
    
    // Get auction counts
    const auctionCountResult = await pool.query('SELECT COUNT(*) as count FROM auctions');
    const totalAuctions = parseInt(auctionCountResult.rows[0].count);
    
    const activeAuctionsResult = await pool.query('SELECT COUNT(*) as count FROM auctions WHERE status = $1', ['active']);
    const activeAuctions = parseInt(activeAuctionsResult.rows[0].count);
    
    const completedAuctionsResult = await pool.query('SELECT COUNT(*) as count FROM auctions WHERE status = $1', ['completed']);
    const completedAuctions = parseInt(completedAuctionsResult.rows[0].count);
    
    // Get recent users (last 5)
    const recentUsersResult = await pool.query(
      'SELECT id, username as name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5'
    );
    const recentUsers = recentUsersResult.rows.map(user => ({
      _id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at
    }));
    
    // Get top products (by current price, limit 5)
    const topProductsResult = await pool.query(
      'SELECT id, name, description, category, price, image_url as imageUrl, status, created_at FROM products ORDER BY price DESC LIMIT 5'
    );
    const topProducts = topProductsResult.rows.map(product => ({
      _id: product.id.toString(),
      name: product.name,
      description: product.description,
      category: product.category,
      currentPrice: parseFloat(product.price),
      imageUrl: product.imageurl || '/uploads/placeholder.jpg', // Fix the field name and add fallback
      status: product.status,
      createdAt: product.created_at,
      bidCount: 0 // We'll add this later when we have bids
    }));
    
    res.json({
      totalUsers,
      totalProducts,
      totalBids,
      activeProducts,
      soldProducts,
      totalAuctions,
      activeAuctions,
      completedAuctions,
      recentUsers,
      topProducts
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
    
    const user = result.rows[0];
    res.json({ 
      user: {
        _id: user.id.toString(),
        name: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = req.app.locals.pool;
    
    // Check if user exists
    const userResult = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bids (admin only)
router.get('/bids', verifyAdminToken, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const { page = 1, limit = 10, productId = '' } = req.query;
    
    let query = `
      SELECT b.id, b.amount, b.created_at as bid_time, b.status,
             u.id as user_id, u.username, u.email,
             p.id as product_id, p.name as product_name, p.image_url, p.price as current_price
      FROM bids b
      JOIN users u ON b.user_id = u.id
      JOIN products p ON b.product_id = p.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;
    
    if (productId) {
      paramCount++;
      query += ` AND b.product_id = $${paramCount}`;
      params.push(productId);
    }
    
    query += ' ORDER BY b.created_at DESC';
    
    // Add pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(parseInt(limit));
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);
    
    const result = await pool.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM bids b WHERE 1=1';
    const countParams = [];
    let countParamCount = 0;
    
    if (productId) {
      countParamCount++;
      countQuery += ` AND b.product_id = $${countParamCount}`;
      countParams.push(productId);
    }
    
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);
    
    const bids = result.rows.map(bid => ({
      _id: bid.id.toString(),
      amount: parseFloat(bid.amount),
      bidTime: bid.bid_time,
      status: bid.status,
      isAutoBid: false, // Default to false since we don't have this field yet
      maxBidAmount: null, // Default to null since we don't have this field yet
      bidder: {
        _id: bid.user_id.toString(),
        name: bid.username,
        email: bid.email
      },
      product: {
        _id: bid.product_id.toString(),
        name: bid.product_name,
        imageUrl: bid.image_url || '/uploads/placeholder.jpg',
        currentPrice: parseFloat(bid.current_price)
      }
    }));
    
    res.json({
      bids,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get bids error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products (admin view with more details)
router.get('/products', verifyAdminToken, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const { page = 1, limit = 10, category = '', status = '' } = req.query;
    
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    let paramCount = 0;
    
    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }
    
    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    // Add pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(parseInt(limit));
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);
    
    const result = await pool.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const countParams = [];
    let countParamCount = 0;
    
    if (category) {
      countParamCount++;
      countQuery += ` AND category = $${countParamCount}`;
      countParams.push(category);
    }
    
    if (status) {
      countParamCount++;
      countQuery += ` AND status = $${countParamCount}`;
      countParams.push(status);
    }
    
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);
    
    const products = result.rows.map(product => ({
      _id: product.id.toString(),
      name: product.name,
      description: product.description,
      category: product.category,
      startingPrice: parseFloat(product.price) * 0.8,
      currentPrice: parseFloat(product.price),
      imageUrl: product.image_url,
      status: product.status,
      endDate: product.end_date ? new Date(product.end_date).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      condition: product.condition || 'excellent',
      location: product.location || 'Toronto, ON',
      shippingCost: parseFloat(product.shipping_cost) || 9.99,
      tags: product.tags || [product.category],
      isFeatured: product.is_featured || false,
      seller: {
        _id: '1',
        name: 'Moez Binz Store',
        email: 'Thebinzstore23@gmail.com'
      },
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));
    
    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (admin only)
router.post('/products', verifyAdminToken, upload.single('image'), async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const { 
      name, 
      description, 
      category, 
      startingPrice, 
      endDate, 
      condition, 
      location, 
      shippingCost, 
      tags, 
      isFeatured 
    } = req.body;

    // Validate required fields
    if (!name || !description || !category || !startingPrice) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Handle image upload (if provided)
    let imageUrl = '/uploads/placeholder.jpg';
    if (req.file) {
      imageUrl = `/uploads/products/${req.file.filename}`;
    }

    // Create product
    const result = await pool.query(`
      INSERT INTO products (name, description, price, image_url, category, status, created_by, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, name, description, price, image_url, category, status, created_at
    `, [name, description, parseFloat(startingPrice), imageUrl, category, 'active', req.user.id]);

    const product = result.rows[0];

    // Transform to match frontend expectations
    const transformedProduct = {
      _id: product.id.toString(),
      name: product.name,
      description: product.description,
      category: product.category,
      startingPrice: parseFloat(product.price),
      currentPrice: parseFloat(product.price),
      imageUrl: product.image_url,
      status: product.status,
      endDate: endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default 7 days
      condition: condition || 'excellent',
      location: location || 'Toronto, ON',
      shippingCost: parseFloat(shippingCost) || 9.99,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [category],
      isFeatured: isFeatured === 'true' || isFeatured === true,
      createdBy: {
        _id: req.user.id.toString(),
        name: 'Admin User',
        email: 'Thebinzstore23@gmail.com'
      },
      createdAt: product.created_at,
      updatedAt: product.created_at
    };

    res.status(201).json({
      message: 'Product created successfully',
      product: transformedProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (admin only)
router.put('/products/:id', verifyAdminToken, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const pool = req.app.locals.pool;
    const { 
      name, 
      description, 
      category, 
      startingPrice, 
      endDate, 
      condition, 
      location, 
      shippingCost, 
      tags, 
      isFeatured,
      status
    } = req.body;

    // Check if product exists
    const productResult = await pool.query('SELECT id FROM products WHERE id = $1', [id]);
    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Handle image upload (if provided)
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/products/${req.file.filename}`;
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];
    let paramCount = 0;

    if (name !== undefined) {
      paramCount++;
      updateFields.push(`name = $${paramCount}`);
      updateValues.push(name);
    }
    if (description !== undefined) {
      paramCount++;
      updateFields.push(`description = $${paramCount}`);
      updateValues.push(description);
    }
    if (category !== undefined) {
      paramCount++;
      updateFields.push(`category = $${paramCount}`);
      updateValues.push(category);
    }
    if (startingPrice !== undefined) {
      paramCount++;
      updateFields.push(`price = $${paramCount}`);
      updateValues.push(parseFloat(startingPrice));
    }
    if (imageUrl !== null) {
      paramCount++;
      updateFields.push(`image_url = $${paramCount}`);
      updateValues.push(imageUrl);
    }
    if (status !== undefined) {
      paramCount++;
      updateFields.push(`status = $${paramCount}`);
      updateValues.push(status);
    }
    if (condition !== undefined) {
      paramCount++;
      updateFields.push(`condition = $${paramCount}`);
      updateValues.push(condition);
    }
    if (location !== undefined) {
      paramCount++;
      updateFields.push(`location = $${paramCount}`);
      updateValues.push(location);
    }
    if (shippingCost !== undefined) {
      paramCount++;
      updateFields.push(`shipping_cost = $${paramCount}`);
      updateValues.push(parseFloat(shippingCost));
    }
    if (tags !== undefined) {
      paramCount++;
      updateFields.push(`tags = $${paramCount}`);
      updateValues.push(Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()));
    }
    if (isFeatured !== undefined) {
      paramCount++;
      updateFields.push(`is_featured = $${paramCount}`);
      updateValues.push(isFeatured === 'true' || isFeatured === true);
    }
    if (endDate !== undefined) {
      paramCount++;
      updateFields.push(`end_date = $${paramCount}`);
      updateValues.push(new Date(endDate));
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    // Add updated_at field without parameter
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    // Add WHERE clause with product ID
    paramCount++;
    updateValues.push(id);

    const updateQuery = `UPDATE products SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(updateQuery, updateValues);
    const product = result.rows[0];

    // Transform to match frontend expectations
    const transformedProduct = {
      _id: product.id.toString(),
      name: product.name,
      description: product.description,
      category: product.category,
      startingPrice: parseFloat(product.price),
      currentPrice: parseFloat(product.price),
      imageUrl: product.image_url,
      status: product.status,
      endDate: product.end_date ? new Date(product.end_date).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      condition: product.condition || 'excellent',
      location: product.location || 'Toronto, ON',
      shippingCost: parseFloat(product.shipping_cost) || 9.99,
      tags: product.tags || [product.category],
      isFeatured: product.is_featured || false,
      createdBy: {
        _id: req.user.id.toString(),
        name: 'Admin User',
        email: 'Thebinzstore23@gmail.com'
      },
      createdAt: product.created_at,
      updatedAt: product.updated_at
    };

    res.json({
      message: 'Product updated successfully',
      product: transformedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (admin only)
router.delete('/products/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = req.app.locals.pool;
    
    // Check if product exists
    const productResult = await pool.query('SELECT id FROM products WHERE id = $1', [id]);
    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete product
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// News Management Routes
// GET /api/admin/news - Get all news with pagination and filters
router.get('/news', verifyAdminToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status || '';
    const featured = req.query.featured || '';
    
    const pool = req.app.locals.pool;
    
    // Build query conditions
    let whereConditions = [];
    let queryParams = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      whereConditions.push(`n.status = $${paramCount}`);
      queryParams.push(status);
    }

    if (featured !== '') {
      paramCount++;
      whereConditions.push(`n.featured = $${paramCount}`);
      queryParams.push(featured === 'true');
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM news n 
      ${whereClause}
    `;
    const countResult = await pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);
    
    // Get news with pagination
    paramCount++;
    queryParams.push(limit);
    paramCount++;
    queryParams.push(offset);

    const newsQuery = `
      SELECT 
        n.*,
        u.username as author_name,
        u.email as author_email
      FROM news n
      LEFT JOIN users u ON n.author_id = u.id
      ${whereClause}
      ORDER BY n.created_at DESC
      LIMIT $${paramCount - 1} OFFSET $${paramCount}
    `;
    
    const result = await pool.query(newsQuery, queryParams);
    
    const totalPages = Math.ceil(total / limit);
    
    // Transform news to match frontend expectations
    const transformedNews = result.rows.map(news => ({
      _id: news.id.toString(),
      title: news.title,
      content: news.content,
      excerpt: news.excerpt,
      imageUrl: news.image_url,
      author: {
        _id: news.author_id?.toString(),
        name: news.author_name,
        email: news.author_email
      },
      status: news.status,
      featured: news.featured,
      publishedAt: news.published_at,
      createdAt: news.created_at,
      updatedAt: news.updated_at
    }));
    
    res.json({
      news: transformedNews,
      totalPages,
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/news/:id - Get single news item
router.get('/news/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = req.app.locals.pool;
    
    const result = await pool.query(`
      SELECT 
        n.*,
        u.username as author_name,
        u.email as author_email
      FROM news n
      LEFT JOIN users u ON n.author_id = u.id
      WHERE n.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    const news = result.rows[0];
    
    const transformedNews = {
      _id: news.id.toString(),
      title: news.title,
      content: news.content,
      excerpt: news.excerpt,
      imageUrl: news.image_url,
      author: {
        _id: news.author_id?.toString(),
        name: news.author_name,
        email: news.author_email
      },
      status: news.status,
      featured: news.featured,
      publishedAt: news.published_at,
      createdAt: news.created_at,
      updatedAt: news.updated_at
    };
    
    res.json({ news: transformedNews });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/news - Create new news
router.post('/news', verifyAdminToken, newsUpload.single('image'), async (req, res) => {
  try {
    const { title, content, excerpt, status, featured } = req.body;
    const authorId = req.user.id; // From admin auth middleware
    const pool = req.app.locals.pool;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Handle image upload
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/news/${req.file.filename}`;
    }

    const result = await pool.query(`
      INSERT INTO news (title, content, excerpt, image_url, author_id, status, featured, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      title,
      content,
      excerpt || null,
      imageUrl,
      authorId,
      status || 'published',
      featured === 'true' || featured === true,
      new Date()
    ]);
    
    const news = result.rows[0];
    
    const transformedNews = {
      _id: news.id.toString(),
      title: news.title,
      content: news.content,
      excerpt: news.excerpt,
      imageUrl: news.image_url,
      author: {
        _id: news.author_id?.toString(),
        name: req.user.username,
        email: req.user.email
      },
      status: news.status,
      featured: news.featured,
      publishedAt: news.published_at,
      createdAt: news.created_at,
      updatedAt: news.updated_at
    };
    
    res.status(201).json({ news: transformedNews });
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/news/:id - Update news
router.put('/news/:id', verifyAdminToken, newsUpload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, status, featured } = req.body;
    const pool = req.app.locals.pool;
    
    // Check if news exists
    const existingNews = await pool.query('SELECT * FROM news WHERE id = $1', [id]);
    if (existingNews.rows.length === 0) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];
    let paramCount = 0;
    
    if (title !== undefined) {
      paramCount++;
      updateFields.push(`title = $${paramCount}`);
      updateValues.push(title);
    }
    
    if (content !== undefined) {
      paramCount++;
      updateFields.push(`content = $${paramCount}`);
      updateValues.push(content);
    }
    
    if (excerpt !== undefined) {
      paramCount++;
      updateFields.push(`excerpt = $${paramCount}`);
      updateValues.push(excerpt);
    }
    
    if (status !== undefined) {
      paramCount++;
      updateFields.push(`status = $${paramCount}`);
      updateValues.push(status);
    }
    
    if (featured !== undefined) {
      paramCount++;
      updateFields.push(`featured = $${paramCount}`);
      updateValues.push(featured === 'true' || featured === true);
    }
    
    // Handle image upload
    if (req.file) {
      paramCount++;
      updateFields.push(`image_url = $${paramCount}`);
      updateValues.push(`/uploads/news/${req.file.filename}`);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    // Add updated_at field
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    // Add WHERE clause with news ID
    paramCount++;
    updateValues.push(id);
    
    const updateQuery = `UPDATE news SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(updateQuery, updateValues);
    
    const news = result.rows[0];
    
    const transformedNews = {
      _id: news.id.toString(),
      title: news.title,
      content: news.content,
      excerpt: news.excerpt,
      imageUrl: news.image_url,
      author: {
        _id: news.author_id?.toString(),
        name: req.user.username,
        email: req.user.email
      },
      status: news.status,
      featured: news.featured,
      publishedAt: news.published_at,
      createdAt: news.created_at,
      updatedAt: news.updated_at
    };
    
    res.json({ news: transformedNews });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admin/news/:id - Delete news
router.delete('/news/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = req.app.locals.pool;
    
    const result = await pool.query('DELETE FROM news WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
