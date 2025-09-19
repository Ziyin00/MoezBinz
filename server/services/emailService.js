const nodemailer = require('nodemailer');

// Create transporter - using Gmail for development
// In production, you should use a proper email service like SendGrid, AWS SES, etc.
const createTransporter = () => {
  // Check if email credentials are configured and valid
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || 
      process.env.EMAIL_USER === 'your-email@gmail.com' || 
      process.env.EMAIL_PASS === 'your-app-password') {
    console.log('⚠️  Email credentials not configured. Using mock email service.');
    return null;
  }

  try {
    // Try Gmail first with improved configuration
    if (process.env.EMAIL_USER.includes('@gmail.com')) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        },
        pool: true,
        maxConnections: 1,
        maxMessages: 3,
        rateDelta: 20000,
        rateLimit: 5
      });
    }
    
    // Try Outlook/Hotmail
    if (process.env.EMAIL_USER.includes('@outlook.com') || process.env.EMAIL_USER.includes('@hotmail.com')) {
      return nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }
    
    // Generic SMTP configuration
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  } catch (error) {
    console.error('Error creating email transporter:', error);
    return null;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, userName) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      // Mock email sending for development
      const resetUrl = `${process.env.FRONTEND_URL || 'https://moez-binz-sepia.vercel.app/'}/reset-password?token=${resetToken}`;
      
      console.log('\n🎯 ===== MOCK PASSWORD RESET EMAIL SENT =====');
      console.log('📧 To:', email);
      console.log('👤 User:', userName);
      console.log('🔗 Reset Link:', resetUrl);
      console.log('⏰ Expires in: 15 minutes');
      console.log('===============================================\n');
      
      return { success: true, messageId: 'mock-email-' + Date.now() };
    }

    // Test the connection first
    try {
      await transporter.verify();
      console.log('✅ Email server connection verified');
    } catch (verifyError) {
      console.error('❌ Email server connection failed:', verifyError.message);
      // Fall back to mock email if connection fails
      const resetUrl = `${process.env.FRONTEND_URL || 'https://moez-binz-sepia.vercel.app/'}/reset-password?token=${resetToken}`;
      
      console.log('\n🎯 ===== FALLBACK: MOCK PASSWORD RESET EMAIL SENT =====');
      console.log('📧 To:', email);
      console.log('👤 User:', userName);
      console.log('🔗 Reset Link:', resetUrl);
      console.log('⏰ Expires in: 15 minutes');
      console.log('⚠️  Real email failed, using mock for development');
      console.log('===============================================\n');
      
      return { success: true, messageId: 'fallback-mock-email-' + Date.now() };
    }
    
    const resetUrl = `${process.env.FRONTEND_URL || 'https://moez-binz-sepia.vercel.app/'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: {
        name: 'MoezBinz Support',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Password Reset Request',
      headers: {
        'X-Mailer': 'MoezBinz-System',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'Importance': 'Normal',
        'Return-Path': process.env.EMAIL_USER,
        'Message-ID': `<${Date.now()}.${Math.random().toString(36).substr(2, 9)}@moezbinz.com>`,
        'Date': new Date().toUTCString()
      },
      replyTo: process.env.EMAIL_USER,
      text: `Password Reset Request

Hello ${userName},

We received a request to reset your password for your MoezBinz account.

To reset your password, please click the link below:
${resetUrl}

This link will expire in 15 minutes for security reasons.

If you did not request this password reset, please ignore this email. Your password will remain unchanged.

Best regards,
The MoezBinz Team`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Password Reset Request</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
            <h2 style="color: #dc2626; margin-bottom: 20px;">Password Reset Request</h2>
            
            <p>Hello ${userName},</p>
            
            <p>We received a request to reset your password for your MoezBinz account.</p>
            
            <p>To reset your password, please click the link below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
            </div>
            
            <p>This link will expire in 15 minutes for security reasons.</p>
            
            <p>If you did not request this password reset, please ignore this email. Your password will remain unchanged.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #666;">
              Best regards,<br>
              The MoezBinz Team
            </p>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Real email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    
    // If real email fails, fall back to mock email for development
    const resetUrl = `${process.env.FRONTEND_URL || 'https://moez-binz-sepia.vercel.app/'}/reset-password?token=${resetToken}`;
    
    console.log('\n🎯 ===== FALLBACK: MOCK PASSWORD RESET EMAIL SENT =====');
    console.log('📧 To:', email);
    console.log('👤 User:', userName);
    console.log('🔗 Reset Link:', resetUrl);
    console.log('⏰ Expires in: 15 minutes');
    console.log('⚠️  Real email failed, using mock for development');
    console.log('===============================================\n');
    
    return { success: true, messageId: 'fallback-mock-email-' + Date.now() };
  }
};

// Send welcome email (optional)
const sendWelcomeEmail = async (email, userName) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      // Mock email sending for development
      console.log('\n🎉 ===== MOCK WELCOME EMAIL SENT =====');
      console.log('📧 To:', email);
      console.log('👤 User:', userName);
      console.log('🎯 Subject: Welcome to MoezBinz!');
      console.log('===============================================\n');
      
      return { success: true, messageId: 'mock-welcome-email-' + Date.now() };
    }
    
    const mailOptions = {
      from: {
        name: 'MoezBinz Treasure Hunt',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Welcome to MoezBinz - Your Treasure Hunt Begins!',
      headers: {
        'X-Mailer': 'MoezBinz-System',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'Importance': 'Normal',
        'Return-Path': process.env.EMAIL_USER
      },
      replyTo: process.env.EMAIL_USER,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to MoezBinz</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
            
            <!-- Header with Gradient -->
            <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
              <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
              <div style="position: absolute; bottom: -30px; left: -30px; width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
              
              <div style="position: relative; z-index: 2;">
                <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                  🏴‍☠️ MoezBinz
                </h1>
                <p style="margin: 8px 0 0 0; font-size: 16px; color: rgba(255,255,255,0.9); font-weight: 300;">
                  Welcome to Your Treasure Hunt Adventure!
                </p>
              </div>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; border: 3px solid #fecaca;">
                  <span style="font-size: 32px;">🎉</span>
                </div>
                <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 28px; font-weight: 600;">
                  Welcome Aboard, ${userName}!
                </h2>
                <p style="color: #6b7280; margin: 0; font-size: 16px;">
                  Your treasure hunting adventure starts now! 🗺️
                </p>
              </div>
              
              <div style="background: linear-gradient(135deg, #fef7f7 0%, #fef2f2 100%); border-left: 4px solid #dc2626; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <p style="color: #374151; margin: 0; line-height: 1.6; font-size: 16px;">
                  Welcome to MoezBinz, the ultimate treasure hunting platform! 
                  We're excited to have you join our community of treasure hunters.
                </p>
              </div>
              
              <!-- Features -->
              <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 20px; border-radius: 12px; margin: 30px 0;">
                <h3 style="color: #0369a1; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                  🎯 What you can do on MoezBinz:
                </h3>
                <ul style="color: #0369a1; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                  <li><strong>🏺 Browse and bid</strong> on amazing treasures from around the world</li>
                  <li><strong>📊 Track your bidding history</strong> and manage your auctions</li>
                  <li><strong>🔍 Discover unique items</strong> in our treasure bins</li>
                  <li><strong>👥 Join our community</strong> of passionate treasure hunters</li>
                </ul>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="${process.env.FRONTEND_URL || 'https://moez-binz-sepia.vercel.app/'}/products" 
                   style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
                          color: white; 
                          padding: 16px 40px; 
                          text-decoration: none; 
                          border-radius: 50px; 
                          font-weight: 600; 
                          font-size: 16px;
                          display: inline-block;
                          box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
                          transition: all 0.3s ease;
                          border: none;
                          cursor: pointer;">
                  🚀 Start Treasure Hunting
                </a>
              </div>
              
              <!-- Footer -->
              <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px; line-height: 1.6;">
                  Happy hunting! 🏴‍☠️<br>
                  <strong style="color: #dc2626;">The MoezBinz Team</strong>
                </p>
              </div>
            </div>
            
            <!-- Bottom Gradient -->
            <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 20px; text-align: center;">
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                This email was sent to ${email} • MoezBinz Treasure Hunt Platform
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
    
    // If real email fails, fall back to mock email for development
    console.log('\n🎉 ===== FALLBACK: MOCK WELCOME EMAIL SENT =====');
    console.log('📧 To:', email);
    console.log('👤 User:', userName);
    console.log('🎯 Subject: Welcome to MoezBinz!');
    console.log('⚠️  Real email failed, using mock for development');
    console.log('===============================================\n');
    
    return { success: true, messageId: 'fallback-mock-welcome-email-' + Date.now() };
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail
};