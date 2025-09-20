const nodemailer = require('nodemailer');

// Create transporter - using the same configuration as password reset
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || 
      process.env.EMAIL_USER === 'your-email@gmail.com' || 
      process.env.EMAIL_PASS === 'your-app-password') {
    console.log('⚠️  Email credentials not configured. Using mock email service.');
    return null;
  }

  try {
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
    
    if (process.env.EMAIL_USER.includes('@outlook.com') || process.env.EMAIL_USER.includes('@hotmail.com')) {
      return nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }
    
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
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

// Send auction won email
const sendAuctionWonEmail = async (email, userName, auctionTitle, winningBid, auctionId) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('\n🎉 ===== MOCK AUCTION WON EMAIL SENT =====');
      console.log('📧 To:', email);
      console.log('👤 User:', userName);
      console.log('🏆 Auction:', auctionTitle);
      console.log('💰 Winning Bid: $' + winningBid);
      console.log('📞 Contact: (416) 555-0123 or info@moezbinz.com');
      console.log('===============================================\n');
      
      return { success: true, messageId: 'mock-auction-won-email-' + Date.now() };
    }

    // Test the connection first
    try {
      await transporter.verify();
      console.log('✅ Email server connection verified');
    } catch (verifyError) {
      console.error('❌ Email server connection failed:', verifyError.message);
      return { success: true, messageId: 'fallback-mock-auction-won-email-' + Date.now() };
    }
    
    const mailOptions = {
      from: {
        name: 'MoezBinz Support',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: '🎉 Congratulations! You Won the Auction!',
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
      text: `Congratulations! You Won the Auction!

Hello ${userName},

Congratulations! You won the auction for "${auctionTitle}" with a winning bid of $${winningBid}.

We're excited to help you complete your purchase! Please contact us to discuss the next steps and arrange for payment and collection.

Contact Information:
- Phone: (416) 555-0123
- Email: info@moezbinz.com
- Store Address: 1150 Sheppard Avenue West, North York
- Store Hours: Monday-Saturday 9AM-6PM

We look forward to hearing from you soon!

Best regards,
The MoezBinz Team`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>You Won the Auction! - MoezBinz</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          </style>
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-height: 100vh;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            
            <!-- Main Card -->
            <div style="background: #ffffff; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; position: relative;">
              
              <!-- Header Section -->
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center; position: relative;">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"25\" cy=\"25\" r=\"1\" fill=\"white\" opacity=\"0.1\"/><circle cx=\"75\" cy=\"75\" r=\"1\" fill=\"white\" opacity=\"0.1\"/><circle cx=\"50\" cy=\"10\" r=\"0.5\" fill=\"white\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>'); opacity: 0.3;"></div>
                
                <div style="position: relative; z-index: 2;">
                  <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.3);">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: white; letter-spacing: -0.5px;">🎉 You Won!</h1>
                  <p style="margin: 8px 0 0 0; font-size: 16px; color: rgba(255,255,255,0.9); font-weight: 400;">Congratulations on winning the auction!</p>
                </div>
              </div>
              
              <!-- Content Section -->
              <div style="padding: 40px 30px;">
                
                <!-- Greeting -->
                <div style="text-align: center; margin-bottom: 30px;">
                  <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600; color: #1f2937; letter-spacing: -0.3px;">Hello ${userName}!</h2>
                  <p style="margin: 0; font-size: 16px; color: #6b7280; line-height: 1.5;">You won the auction for "${auctionTitle}"</p>
                </div>
                
                <!-- Winning Details -->
                <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-left: 4px solid #10b981; padding: 24px; border-radius: 12px; margin: 30px 0;">
                  <div style="text-align: center;">
                    <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 600; color: #059669;">Winning Bid</h3>
                    <p style="margin: 0; font-size: 32px; font-weight: 700; color: #059669;">$${winningBid}</p>
                  </div>
                </div>
                
                <!-- Contact Information -->
                <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #0ea5e9; padding: 24px; border-radius: 12px; margin: 30px 0;">
                  <div style="text-align: center; margin-bottom: 20px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 600; color: #0369a1;">Next Steps</h3>
                    <p style="margin: 0; font-size: 16px; color: #0369a1;">Contact us to discuss payment and collection details</p>
                  </div>
                  
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                    <div style="text-align: center;">
                      <div style="width: 50px; height: 50px; background: #0ea5e9; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                      <p style="margin: 0; font-size: 14px; color: #0369a1; font-weight: 600;">Phone</p>
                      <p style="margin: 5px 0 0 0; font-size: 16px; color: #0369a1;">(416) 555-0123</p>
                    </div>
                    
                    <div style="text-align: center;">
                      <div style="width: 50px; height: 50px; background: #0ea5e9; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <polyline points="22,6 12,13 2,6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                      <p style="margin: 0; font-size: 14px; color: #0369a1; font-weight: 600;">Email</p>
                      <p style="margin: 5px 0 0 0; font-size: 16px; color: #0369a1;">info@moezbinz.com</p>
                    </div>
                  </div>
                  
                  <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(14, 165, 233, 0.2);">
                    <p style="margin: 0 0 5px 0; font-size: 14px; color: #0369a1; font-weight: 600;">Store Address</p>
                    <p style="margin: 0 0 5px 0; font-size: 16px; color: #0369a1;">1150 Sheppard Avenue West, North York</p>
                    <p style="margin: 0; font-size: 14px; color: #0369a1;">Monday-Saturday 9AM-6PM</p>
                  </div>
                </div>
                
                <!-- Footer -->
                <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                    Congratulations on your win!<br>
                    <strong style="color: #10b981;">The MoezBinz Team</strong>
                  </p>
                  <div style="margin-top: 20px;">
                    <a href="${process.env.FRONTEND_URL || 'https://moez-binz-sepia.vercel.app/'}" style="color: #10b981; text-decoration: none; font-size: 14px; font-weight: 500;">Visit MoezBinz</a>
                  </div>
                </div>
                
              </div>
              
              <!-- Bottom Bar -->
              <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 20px; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                  This email was sent to ${email} • MoezBinz Auction Platform
                </p>
              </div>
              
            </div>
            
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Auction won email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending auction won email:', error.message);
    
    // Fall back to mock email
    console.log('\n🎉 ===== FALLBACK: MOCK AUCTION WON EMAIL SENT =====');
    console.log('📧 To:', email);
    console.log('👤 User:', userName);
    console.log('🏆 Auction:', auctionTitle);
    console.log('💰 Winning Bid: $' + winningBid);
    console.log('📞 Contact: (416) 555-0123 or info@moezbinz.com');
    console.log('===============================================\n');
    
    return { success: true, messageId: 'fallback-mock-auction-won-email-' + Date.now() };
  }
};

// Send outbid notification email
const sendOutbidEmail = async (email, userName, auctionTitle, currentBid) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('\n📢 ===== MOCK OUTBID EMAIL SENT =====');
      console.log('📧 To:', email);
      console.log('👤 User:', userName);
      console.log('📈 Auction:', auctionTitle);
      console.log('💰 Current Bid: $' + currentBid);
      console.log('===============================================\n');
      
      return { success: true, messageId: 'mock-outbid-email-' + Date.now() };
    }

    const mailOptions = {
      from: {
        name: 'MoezBinz Support',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'You Were Outbid - ' + auctionTitle,
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
      text: `You Were Outbid

Hello ${userName},

Someone placed a higher bid on the auction "${auctionTitle}". The current bid is now $${currentBid}.

If you'd like to place a higher bid, visit our auction page and place your bid before the auction ends.

Best regards,
The MoezBinz Team`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>You Were Outbid - MoezBinz</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
            <h2 style="color: #dc2626; margin-bottom: 20px;">You Were Outbid</h2>
            
            <p>Hello ${userName},</p>
            
            <p>Someone placed a higher bid on the auction <strong>"${auctionTitle}"</strong>. The current bid is now <strong>$${currentBid}</strong>.</p>
            
            <p>If you'd like to place a higher bid, visit our auction page and place your bid before the auction ends.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'https://moez-binz-sepia.vercel.app/'}/auctions" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">View Auctions</a>
            </div>
            
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
    console.log('✅ Outbid email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending outbid email:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendAuctionWonEmail,
  sendOutbidEmail
};
