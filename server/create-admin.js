require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function createAdmin() {
  try {
    console.log('🔧 Creating admin user...');

    const adminEmail = 'admin@moezbinz.com';
    const adminPassword = 'admin123';
    const adminName = 'Admin User';

    // Check if admin already exists
    const existsResult = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    if (existsResult.rows.length > 0) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Create admin user
    const result = await pool.query(
      'INSERT INTO users (username, email, password, role, is_verified) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, role',
      [adminName, adminEmail, hashedPassword, 'admin', true]
    );

    const admin = result.rows[0];
    console.log('🎉 Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('👤 Username:', admin.username);
    console.log('🔑 Password:', adminPassword);
    console.log('🛡️ Role:', admin.role);
    console.log('🆔 ID:', admin.id);
    
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
  } finally {
    await pool.end();
  }
}

createAdmin();
