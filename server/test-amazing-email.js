require('dotenv').config();
const { Pool } = require('pg');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('./services/emailService');

async function testAmazingEmail() {
  console.log('🎨 Testing Amazing New Email Template\n');
  
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
    
    console.log('🎨 Sending amazing new email template...');
    const emailResult = await sendPasswordResetEmail(user.email, resetToken, user.username);
    
    if (emailResult.success) {
      console.log('✅ Amazing email sent successfully!');
      console.log('📧 Message ID:', emailResult.messageId);
      
      console.log('\n🎨 New Email Template Features:');
      console.log('✨ Beautiful gradient background');
      console.log('✨ Modern Inter font family');
      console.log('✨ Professional card-based design');
      console.log('✨ Subtle texture patterns');
      console.log('✨ Glassmorphism effects');
      console.log('✨ Custom SVG icons');
      console.log('✨ Responsive design');
      console.log('✨ Professional color scheme');
      console.log('✨ Clean typography');
      console.log('✨ Security notice section');
      console.log('✨ Alternative link fallback');
      
      console.log('\n📬 Check usufeezz@gmail.com for:');
      console.log('   Subject: "Password Reset Request"');
      console.log('   From: "MoezBinz Support <ziyinab00@gmail.com>"');
      console.log('   Beautiful HTML email with modern design');
      
      console.log('\n🔗 Reset link:');
      console.log(`http://localhost:5175/reset-password?token=${resetToken}`);
      
      console.log('\n🎯 Email Design Highlights:');
      console.log('• Gradient header with shield icon');
      console.log('• Professional greeting section');
      console.log('• Highlighted main message box');
      console.log('• Prominent CTA button with shadow');
      console.log('• Security notice with warning icon');
      console.log('• Clean alternative link section');
      console.log('• Professional footer');
      console.log('• Mobile-responsive design');
      
    } else {
      console.log('❌ Email sending failed:', emailResult.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await pool.end();
  }
}

testAmazingEmail();
