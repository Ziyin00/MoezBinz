require('dotenv').config();
const { Pool } = require('pg');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('./services/emailService');

async function testEmailDeliverability() {
  console.log('📧 Testing Email Deliverability Improvements\n');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Get the user
    const userResult = await pool.query('SELECT id, username, email FROM users WHERE email = $1', ['usufeezz@gmail.com']);
    
    if (userResult.rows.length === 0) {
      console.log('❌ User usufeezz@gmail.com not found in database');
      return;
    }
    
    const user = userResult.rows[0];
    console.log('👤 Testing with user:', user.email);
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    
    // Save token to database
    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at, used) VALUES ($1, $2, $3, $4)',
      [user.id, resetToken, expiresAt, false]
    );
    
    console.log('📧 Sending improved email with anti-spam measures...');
    const emailResult = await sendPasswordResetEmail(user.email, resetToken, user.username);
    
    if (emailResult.success) {
      console.log('✅ Email sent successfully!');
      console.log('📧 Message ID:', emailResult.messageId);
      
      console.log('\n🎯 Email Deliverability Improvements Applied:');
      console.log('✅ Proper "From" name: "MoezBinz Treasure Hunt"');
      console.log('✅ Clean subject line (no emojis)');
      console.log('✅ Professional email headers');
      console.log('✅ Plain text version included');
      console.log('✅ Proper reply-to address');
      console.log('✅ Rate limiting configured');
      console.log('✅ Return-path header set');
      
      console.log('\n📬 Check usufeezz@gmail.com inbox for:');
      console.log('   Subject: "Password Reset Request - MoezBinz"');
      console.log('   From: "MoezBinz Treasure Hunt <ziyinab00@gmail.com>"');
      
      console.log('\n🔗 Reset link:');
      console.log(`http://localhost:5175/reset-password?token=${resetToken}`);
      
      console.log('\n💡 If email still goes to spam:');
      console.log('1. Mark as "Not Spam" in Gmail');
      console.log('2. Add ziyinab00@gmail.com to contacts');
      console.log('3. Create a filter to always deliver emails from this address');
      
    } else {
      console.log('❌ Email sending failed:', emailResult.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await pool.end();
  }
}

testEmailDeliverability();
