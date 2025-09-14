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
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // Your Gmail app password
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
    
    const resetUrl = `${process.env.FRONTEND_URL || 'https://moez-binz-sepia.vercel.app/'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 Password Reset - MoezBinz Treasure Hunt',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - MoezBinz</title>
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
                  Your Treasure Hunt Adventure Awaits
                </p>
              </div>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; border: 3px solid #fecaca;">
                  <span style="font-size: 32px;">🔐</span>
                </div>
                <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 28px; font-weight: 600;">
                  Password Reset Request
                </h2>
                <p style="color: #6b7280; margin: 0; font-size: 16px;">
                  Hello <strong style="color: #dc2626;">${userName}</strong>! 👋
                </p>
              </div>
              
              <div style="background: linear-gradient(135deg, #fef7f7 0%, #fef2f2 100%); border-left: 4px solid #dc2626; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <p style="color: #374151; margin: 0; line-height: 1.6; font-size: 16px;">
                  We received a request to reset your password for your MoezBinz account. 
                  Don't worry, it happens to the best treasure hunters! 🗺️
                </p>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="${resetUrl}" 
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
                  🚀 Reset My Password
                </a>
              </div>
              
              <!-- Alternative Link -->
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px; font-weight: 500;">
                  🔗 Can't click the button? Copy and paste this link:
                </p>
                <p style="color: #dc2626; word-break: break-all; font-size: 14px; margin: 0; padding: 10px; background-color: white; border-radius: 4px; border: 1px solid #e5e7eb;">
                  ${resetUrl}
                </p>
              </div>
              
              <!-- Security Notice -->
              <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); 
                          border: 1px solid #fecaca; 
                          padding: 20px; 
                          border-radius: 12px; 
                          margin: 30px 0;
                          position: relative;">
                <div style="position: absolute; top: -8px; left: 20px; background: #dc2626; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                  ⚠️ SECURITY NOTICE
                </div>
                <ul style="color: #dc2626; margin: 15px 0 0 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                  <li><strong>⏰ Expires in 15 minutes</strong> - Act fast, treasure hunter!</li>
                  <li><strong>🔒 Secure link</strong> - Only works once for your account</li>
                  <li><strong>❓ Didn't request this?</strong> - Simply ignore this email</li>
                  <li><strong>🛡️ Your password stays safe</strong> - Until you click the link</li>
                </ul>
              </div>
              
              <!-- Footer -->
              <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px; line-height: 1.6;">
                  Happy treasure hunting! 🏴‍☠️<br>
                  <strong style="color: #dc2626;">The MoezBinz Team</strong>
                </p>
                <div style="margin-top: 20px;">
                  <a href="${process.env.FRONTEND_URL || 'https://moez-binz-sepia.vercel.app/'}" 
                     style="color: #dc2626; text-decoration: none; font-size: 14px; font-weight: 500;">
                    🌟 Visit MoezBinz
                  </a>
                </div>
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
    console.log('✅ Real email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    return { success: false, error: error.message };
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
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🎉 Welcome to MoezBinz - Your Treasure Hunt Begins!',
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
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail
};