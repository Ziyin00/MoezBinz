const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const Bid = require('../models/Bid');
const verifyAccessToken = require('../middleware/auth');
const verifyAdminAccess = require('../middleware/adminAuth');

const router = express.Router();

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

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (status) filter.status = status;
    
    const products = await Product.find(filter)
      .populate('createdBy', 'name email')
      .populate('winner', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments(filter);
    
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('winner', 'name email');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Get bids for this product
    const bids = await Bid.find({ product: req.params.id })
      .populate('bidder', 'name email')
      .sort({ amount: -1, bidTime: -1 });
    
    res.json({ product, bids });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product (admin only)
router.post('/', verifyAdminAccess, upload.single('image'), async (req, res) => {
  try {
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
    
    const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : null;
    
    if (!imageUrl) {
      return res.status(400).json({ message: 'Product image is required' });
    }
    
    const product = new Product({
      name,
      description,
      category,
      startingPrice: parseFloat(startingPrice),
      currentPrice: parseFloat(startingPrice),
      imageUrl,
      endDate: new Date(endDate),
      createdBy: req.user._id,
      condition,
      location,
      shippingCost: parseFloat(shippingCost) || 0,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      isFeatured: isFeatured === 'true'
    });
    
    await product.save();
    await product.populate('createdBy', 'name email');
    
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product (admin only)
router.put('/:id', verifyAdminAccess, upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.imageUrl = `/uploads/products/${req.file.filename}`;
    }
    
    if (updateData.startingPrice) {
      updateData.startingPrice = parseFloat(updateData.startingPrice);
    }
    
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }
    
    if (updateData.tags) {
      updateData.tags = updateData.tags.split(',').map(tag => tag.trim());
    }
    
    if (updateData.isFeatured !== undefined) {
      updateData.isFeatured = updateData.isFeatured === 'true';
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('createdBy', 'name email');
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', verifyAdminAccess, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete associated bids
    await Bid.deleteMany({ product: req.params.id });
    
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product bids (admin only)
router.get('/:id/bids', verifyAdminAccess, async (req, res) => {
  try {
    const bids = await Bid.find({ product: req.params.id })
      .populate('bidder', 'name email')
      .sort({ amount: -1, bidTime: -1 });
    
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
