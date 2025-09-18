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
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      condition: 'excellent',
      location: 'Toronto, ON',
      shippingCost: 9.99,
      tags: [product.category],
      isFeatured: Math.random() > 0.7,
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

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    paramCount++;
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
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
      endDate: endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      condition: condition || 'excellent',
      location: location || 'Toronto, ON',
      shippingCost: parseFloat(shippingCost) || 9.99,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [product.category],
      isFeatured: isFeatured === 'true' || isFeatured === true,
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

module.exports = router;
