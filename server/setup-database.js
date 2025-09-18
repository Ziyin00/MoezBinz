require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database tables...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        is_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Create products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image_url VARCHAR(500),
        category VARCHAR(100),
        status VARCHAR(20) DEFAULT 'active',
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Products table created');

    // Create bids table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bids (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Bids table created');

    // Create password reset tokens table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Password reset tokens table created');

    // Create indexes for better performance
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_bids_product_id ON bids(product_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_bids_user_id ON bids(user_id)');
    console.log('✅ Database indexes created');

    // Create admin user if it doesn't exist
    const adminEmail = 'Thebinzstore23@gmail.com';
    const adminExists = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    
    if (adminExists.rows.length === 0) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await pool.query(
        'INSERT INTO users (username, email, password, role, is_verified) VALUES ($1, $2, $3, $4, $5)',
        ['Admin User', adminEmail, hashedPassword, 'admin', true]
      );
        console.log('✅ Admin user created (Thebinzstore23@gmail.com / admin123)');
    } else {
      console.log('✅ Admin user already exists');
    }

    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase();
