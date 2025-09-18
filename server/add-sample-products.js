require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 89.99,
    imageUrl: '/uploads/placeholder.jpg',
    category: 'electronics'
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking with heart rate monitor, GPS, and water resistance.',
    price: 199.99,
    imageUrl: '/uploads/placeholder.jpg',
    category: 'electronics'
  },
  {
    name: 'Vintage Leather Handbag',
    description: 'Authentic vintage leather handbag in excellent condition, perfect for any occasion.',
    price: 45.99,
    imageUrl: '/uploads/placeholder.jpg',
    category: 'fashion'
  },
  {
    name: 'Coffee Maker Deluxe',
    description: 'Professional-grade coffee maker with programmable settings and thermal carafe.',
    price: 129.99,
    imageUrl: '/uploads/placeholder.jpg',
    category: 'home'
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with superior cushioning and breathable mesh upper.',
    price: 79.99,
    imageUrl: '/uploads/placeholder.jpg',
    category: 'sports'
  },
  {
    name: 'Board Game Collection',
    description: 'Classic board game collection including Monopoly, Scrabble, and Chess.',
    price: 34.99,
    imageUrl: '/uploads/placeholder.jpg',
    category: 'toys'
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with 360-degree sound and 12-hour battery life.',
    price: 59.99,
    imageUrl: '/uploads/placeholder.jpg',
    category: 'electronics'
  },
  {
    name: 'Kitchen Knife Set',
    description: 'Professional 8-piece stainless steel knife set with wooden block.',
    price: 89.99,
    imageUrl: '/uploads/placeholder.jpg',
    category: 'home'
  }
];

async function addSampleProducts() {
  try {
    console.log('🔧 Adding sample products...');

    // Clear existing products first
    await pool.query('DELETE FROM products');
    console.log('✅ Cleared existing products');

    // Add sample products
    for (const product of sampleProducts) {
      await pool.query(
        'INSERT INTO products (name, description, price, image_url, category, status) VALUES ($1, $2, $3, $4, $5, $6)',
        [product.name, product.description, product.price, product.imageUrl, product.category, 'active']
      );
    }

    console.log(`✅ Added ${sampleProducts.length} sample products`);
    
    // Show what was added
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    console.log('📦 Sample products added:');
    result.rows.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (${product.category})`);
    });
    
  } catch (error) {
    console.error('❌ Failed to add sample products:', error);
  } finally {
    await pool.end();
  }
}

addSampleProducts();
