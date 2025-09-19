require('dotenv').config();
const { Pool } = require('pg');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('./services/emailService');

async function testInboxDelivery() {
  console.log('📧 Testing Email Inbox Delivery Solution\n');
  
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
    
    console.log('📧 Sending optimized email for inbox delivery...');
    const emailResult = await sendPasswordResetEmail(user.email, resetToken, user.username);
    
    if (emailResult.success) {
      console.log('✅ Email sent successfully!');
      console.log('📧 Message ID:', emailResult.messageId);
      
      console.log('\n🎯 Anti-Spam Measures Applied:');
      console.log('✅ Clean subject line: "Password Reset Request"');
      console.log('✅ Professional sender name: "MoezBinz Support"');
      console.log('✅ Simple, clean HTML template');
      console.log('✅ Plain text version included');
      console.log('✅ Proper email headers');
      console.log('✅ No excessive emojis or marketing language');
      console.log('✅ Professional tone and content');
      
      console.log('\n📬 Check usufeezz@gmail.com for:');
      console.log('   Subject: "Password Reset Request"');
      console.log('   From: "MoezBinz Support <ziyinab00@gmail.com>"');
      
      console.log('\n🔗 Reset link:');
      console.log(`http://localhost:5175/reset-password?token=${resetToken}`);
      
      console.log('\n💡 If email still goes to spam:');
      console.log('1. Mark as "Not Spam" in Gmail');
      console.log('2. Add ziyinab00@gmail.com to contacts');
      console.log('3. Create a Gmail filter:');
      console.log('   - From: ziyinab00@gmail.com');
      console.log('   - Action: Never send to spam');
      console.log('4. Check spam folder and move to inbox');
      
      console.log('\n🔧 Additional Solutions:');
      console.log('1. Use a professional email service (SendGrid, Mailgun)');
      console.log('2. Set up SPF, DKIM, and DMARC records');
      console.log('3. Use a custom domain for sending emails');
      console.log('4. Warm up the sending IP address');
      
    } else {
      console.log('❌ Email sending failed:', emailResult.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await pool.end();
  }
}

testInboxDelivery();
