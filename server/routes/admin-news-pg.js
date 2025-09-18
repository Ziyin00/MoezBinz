const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('../middleware/adminAuth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/news/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'news-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
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

// Apply admin authentication to all routes
router.use(verifyAdminToken);

// GET /api/admin/news - Get all news with pagination and filters
router.get('/', async (req, res) => {
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
router.get('/:id', async (req, res) => {
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
router.post('/', upload.single('image'), async (req, res) => {
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
router.put('/:id', upload.single('image'), async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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
