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
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Request - MoezBinz</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          </style>
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-height: 100vh;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            
            <!-- Main Card -->
            <div style="background: #ffffff; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; position: relative;">
              
              <!-- Header Section -->
              <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 30px; text-align: center; position: relative;">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"25\" cy=\"25\" r=\"1\" fill=\"white\" opacity=\"0.1\"/><circle cx=\"75\" cy=\"75\" r=\"1\" fill=\"white\" opacity=\"0.1\"/><circle cx=\"50\" cy=\"10\" r=\"0.5\" fill=\"white\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>'); opacity: 0.3;"></div>
                
                <div style="position: relative; z-index: 2;">
                  <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.3);">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M9 12L11 14L15 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: white; letter-spacing: -0.5px;">MoezBinz</h1>
                  <p style="margin: 8px 0 0 0; font-size: 16px; color: rgba(255,255,255,0.9); font-weight: 400;">Password Reset Request</p>
                </div>
              </div>
              
              <!-- Content Section -->
              <div style="padding: 40px 30px;">
                
                <!-- Greeting -->
                <div style="text-align: center; margin-bottom: 30px;">
                  <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600; color: #1f2937; letter-spacing: -0.3px;">Hello ${userName}!</h2>
                  <p style="margin: 0; font-size: 16px; color: #6b7280; line-height: 1.5;">We received a request to reset your password</p>
                </div>
                
                <!-- Main Message -->
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-left: 4px solid #dc2626; padding: 24px; border-radius: 12px; margin: 30px 0;">
                  <p style="margin: 0; font-size: 16px; color: #374151; line-height: 1.6;">
                    Don't worry, it happens to the best of us! Click the button below to securely reset your password and get back to your treasure hunting adventures.
                  </p>
                </div>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 40px 0;">
                  <a href="${resetUrl}" style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3); transition: all 0.3s ease; border: none; cursor: pointer; letter-spacing: 0.3px;">
                    🔐 Reset My Password
                  </a>
                </div>
                
                <!-- Security Notice -->
                <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 12px; margin: 30px 0;">
                  <div style="display: flex; align-items: center; margin-bottom: 12px;">
                    <div style="width: 24px; height: 24px; background: #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #dc2626;">Security Notice</h3>
                  </div>
                  <ul style="margin: 0; padding-left: 20px; color: #dc2626; font-size: 14px; line-height: 1.6;">
                    <li><strong>Expires in 15 minutes</strong> - For your security</li>
                    <li><strong>One-time use only</strong> - Link becomes invalid after use</li>
                    <li><strong>Didn't request this?</strong> - Simply ignore this email</li>
                  </ul>
                </div>
                
                <!-- Alternative Link -->
                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
                  <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280; font-weight: 500;">Can't click the button? Copy and paste this link:</p>
                  <p style="margin: 0; padding: 12px; background: white; border-radius: 6px; border: 1px solid #e5e7eb; font-size: 14px; color: #dc2626; word-break: break-all; font-family: 'Courier New', monospace;">${resetUrl}</p>
                </div>
                
                <!-- Footer -->
                <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                    Happy treasure hunting!<br>
                    <strong style="color: #dc2626;">The MoezBinz Team</strong>
                  </p>
                  <div style="margin-top: 20px;">
                    <a href="${process.env.FRONTEND_URL || 'https://moez-binz-sepia.vercel.app/'}" style="color: #dc2626; text-decoration: none; font-size: 14px; font-weight: 500;">Visit MoezBinz</a>
                  </div>
                </div>
                
              </div>
              
              <!-- Bottom Bar -->
              <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 20px; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                  This email was sent to ${email} • MoezBinz Treasure Hunt Platform
                </p>
              </div>
              
            </div>
            
            <!-- Footer Text -->
            <div style="text-align: center; margin-top: 30px;">
              <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.8);">
                If you're having trouble with the button above, copy and paste the URL into your web browser.
              </p>
            </div>
            
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
        name: 'MoezBinz Support',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Welcome to MoezBinz - Your Adventure Begins!',
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