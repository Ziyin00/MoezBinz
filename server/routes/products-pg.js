const express = require('express');
const router = express.Router();

// GET /api/products - Get all active products with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    
    const pool = req.app.locals.pool;
    
    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) as total FROM products WHERE status = $1', ['active']);
    const total = parseInt(countResult.rows[0].total);
    
    // Get products with pagination
    const result = await pool.query(
      'SELECT * FROM products WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      ['active', limit, offset]
    );
    
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      products: result.rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = req.app.locals.pool;
    
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ product: result.rows[0] });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/products - Create new product (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, description, price, imageUrl, category } = req.body;
    
    if (!name || !description || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const pool = req.app.locals.pool;
    
    const result = await pool.query(
      'INSERT INTO products (name, description, price, image_url, category, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, imageUrl || '/uploads/placeholder.jpg', category || 'general', 'active']
    );
    
    res.status(201).json({ product: result.rows[0] });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl, category, status } = req.body;
    
    const pool = req.app.locals.pool;
    
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, image_url = $4, category = $5, status = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [name, description, price, imageUrl, category, status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ product: result.rows[0] });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = req.app.locals.pool;
    
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
