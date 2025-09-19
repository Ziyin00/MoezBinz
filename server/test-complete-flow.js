require('dotenv').config();
const { Pool } = require('pg');
const { sendPasswordResetEmail } = require('./services/emailService');

async function testCompleteFlow() {
  console.log('🧪 Testing Complete Forgot Password Flow\n');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Get users from database
    const usersResult = await pool.query('SELECT id, username, email FROM users');
    console.log('📋 Users in database:');
    usersResult.rows.forEach(user => {
      console.log(`   - ${user.email} (${user.username})`);
    });
    
    if (usersResult.rows.length === 0) {
      console.log('❌ No users found in database');
      return;
    }
    
    // Test with first user
    const testUser = usersResult.rows[0];
    console.log(`\n🎯 Testing with user: ${testUser.email}`);
    
    // Generate reset token
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    
    console.log('🔑 Generated reset token:', resetToken.substring(0, 20) + '...');
    
    // Save token to database
    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at, used) VALUES ($1, $2, $3, $4)',
      [testUser.id, resetToken, expiresAt, false]
    );
    console.log('💾 Reset token saved to database');
    
    // Send email
    console.log('📧 Sending password reset email...');
    const emailResult = await sendPasswordResetEmail(testUser.email, resetToken, testUser.username);
    console.log('📧 Email result:', emailResult);
    
    if (emailResult.success) {
      console.log('\n✅ SUCCESS! Real email sent!');
      console.log('📬 Check your email inbox for the password reset link');
      console.log(`🔗 Reset link: http://localhost:5175/reset-password?token=${resetToken}`);
    } else {
      console.log('\n❌ Email sending failed:', emailResult.error);
    }
    
    // Verify token in database
    const tokenResult = await pool.query(
      'SELECT * FROM password_reset_tokens WHERE token = $1',
      [resetToken]
    );
    console.log('\n🔍 Token verification:', tokenResult.rows.length > 0 ? '✅ Found in database' : '❌ Not found');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await pool.end();
  }
}

testCompleteFlow();
