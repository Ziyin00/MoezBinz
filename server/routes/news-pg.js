const express = require('express');
const router = express.Router();

// GET /api/news - Get all published news with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    const featured = req.query.featured || '';
    
    const pool = req.app.locals.pool;
    
    // Build query conditions
    let whereConditions = ['n.status = $1'];
    let queryParams = ['published'];
    let paramCount = 1;

    if (featured === 'true') {
      paramCount++;
      whereConditions.push(`n.featured = $${paramCount}`);
      queryParams.push(true);
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

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
        n.id,
        n.title,
        n.content,
        n.excerpt,
        n.image_url,
        n.featured,
        n.published_at,
        n.created_at,
        u.username as author_name
      FROM news n
      LEFT JOIN users u ON n.author_id = u.id
      ${whereClause}
      ORDER BY n.featured DESC, n.published_at DESC
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
        name: news.author_name || 'Admin'
      },
      featured: news.featured,
      publishedAt: news.published_at,
      createdAt: news.created_at
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

// GET /api/news/:id - Get single news item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = req.app.locals.pool;
    
    const result = await pool.query(`
      SELECT 
        n.id,
        n.title,
        n.content,
        n.excerpt,
        n.image_url,
        n.featured,
        n.published_at,
        n.created_at,
        u.username as author_name
      FROM news n
      LEFT JOIN users u ON n.author_id = u.id
      WHERE n.id = $1 AND n.status = 'published'
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
        name: news.author_name || 'Admin'
      },
      featured: news.featured,
      publishedAt: news.published_at,
      createdAt: news.created_at
    };
    
    res.json({ news: transformedNews });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/news/featured - Get featured news
router.get('/featured/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const pool = req.app.locals.pool;
    
    const result = await pool.query(`
      SELECT 
        n.id,
        n.title,
        n.excerpt,
        n.image_url,
        n.published_at,
        u.username as author_name
      FROM news n
      LEFT JOIN users u ON n.author_id = u.id
      WHERE n.status = 'published' AND n.featured = true
      ORDER BY n.published_at DESC
      LIMIT $1
    `, [limit]);
    
    const transformedNews = result.rows.map(news => ({
      _id: news.id.toString(),
      title: news.title,
      excerpt: news.excerpt,
      imageUrl: news.image_url,
      author: {
        name: news.author_name || 'Admin'
      },
      publishedAt: news.published_at
    }));
    
    res.json({ news: transformedNews });
  } catch (error) {
    console.error('Get featured news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
