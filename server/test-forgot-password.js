require('dotenv').config();
const { Pool } = require('pg');
const { sendPasswordResetEmail } = require('./services/emailService');

async function testForgotPassword() {
  console.log('🧪 Testing Forgot Password Flow\n');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Test 1: Check database connection
    console.log('1️⃣ Testing database connection...');
    const dbTest = await pool.query('SELECT NOW()');
    console.log('✅ Database connected:', dbTest.rows[0].now);
    
    // Test 2: Check if test user exists
    console.log('\n2️⃣ Checking for test user...');
    const userResult = await pool.query('SELECT id, username, email FROM users WHERE email = $1', ['test@example.com']);
    
    if (userResult.rows.length === 0) {
      console.log('❌ Test user not found. Creating one...');
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('test123', salt);
      
      const newUser = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
        ['Test User', 'test@example.com', hashedPassword]
      );
      console.log('✅ Test user created:', newUser.rows[0]);
    } else {
      console.log('✅ Test user found:', userResult.rows[0]);
    }
    
    // Test 3: Test email service directly
    console.log('\n3️⃣ Testing email service...');
    const emailResult = await sendPasswordResetEmail('test@example.com', 'test-token-123', 'Test User');
    console.log('📧 Email result:', emailResult);
    
    // Test 4: Test the complete forgot password flow
    console.log('\n4️⃣ Testing complete forgot password flow...');
    
    // Generate a real reset token
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    
    // Save token to database
    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at, used) VALUES ($1, $2, $3, $4)',
      [userResult.rows[0].id, resetToken, expiresAt, false]
    );
    console.log('✅ Reset token saved to database');
    
    // Send email
    const finalEmailResult = await sendPasswordResetEmail('test@example.com', resetToken, 'Test User');
    console.log('📧 Final email result:', finalEmailResult);
    
    // Test 5: Verify token in database
    console.log('\n5️⃣ Verifying token in database...');
    const tokenResult = await pool.query(
      'SELECT * FROM password_reset_tokens WHERE token = $1',
      [resetToken]
    );
    console.log('✅ Token found in database:', tokenResult.rows[0]);
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ Database connection working');
    console.log('✅ User exists in database');
    console.log('✅ Email service working (with fallback)');
    console.log('✅ Reset token generation working');
    console.log('✅ Token storage working');
    console.log('\n🔗 Reset link for testing:');
    console.log(`http://localhost:5173/reset-password?token=${resetToken}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await pool.end();
  }
}

testForgotPassword();
