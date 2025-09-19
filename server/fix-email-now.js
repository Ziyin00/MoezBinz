const fs = require('fs');
const nodemailer = require('nodemailer');

console.log('🎯 MoezBinz Email Fix');
console.log('====================\n');

// Test current credentials
async function testCurrent() {
  console.log('🧪 Testing current Gmail setup...');
  
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ziyinab00@gmail.com',
        pass: 'zjjc yqaf wpzq jokm'
      },
      tls: { rejectUnauthorized: false }
    });

    await transporter.verify();
    console.log('✅ Current Gmail setup is working!');
    return true;
    
  } catch (error) {
    console.log('❌ Current Gmail setup failed:', error.message);
    return false;
  }
}

// Update .env with new credentials
function updateEnv(email, password) {
  const envPath = '.env';
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  const lines = envContent.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('EMAIL_USER=')) {
      lines[i] = `EMAIL_USER=${email}`;
    } else if (lines[i].startsWith('EMAIL_PASS=')) {
      lines[i] = `EMAIL_PASS=${password}`;
    }
  }
  
  fs.writeFileSync(envPath, lines.join('\n'));
  console.log('✅ .env file updated!');
}

// Test new credentials
async function testNew(email, password, service = 'gmail') {
  console.log(`\n🧪 Testing ${service} setup...`);
  
  try {
    let transporter;
    
    if (service === 'outlook') {
      transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: { user: email, pass: password }
      });
    } else {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: email, pass: password },
        tls: { rejectUnauthorized: false }
      });
    }

    await transporter.verify();
    console.log('✅ Connection successful!');
    
    const result = await transporter.sendMail({
      from: email,
      to: email,
      subject: '🎉 MoezBinz Email Test - SUCCESS!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #dc2626;">🎉 Email Test Successful!</h2>
          <p>Your MoezBinz email service is now working!</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Service:</strong> ${service}</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666;">Your forgot password feature will now send real emails!</p>
        </div>
      `
    });
    
    console.log('✅ Test email sent! Message ID:', result.messageId);
    console.log('📬 Check your inbox for the test email.');
    
    updateEnv(email, password);
    return true;
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('📧 Email Setup Options:');
  console.log('1. Test current Gmail setup');
  console.log('2. Set up new Gmail credentials');
  console.log('3. Set up Outlook (recommended)');
  console.log('4. Set up Yahoo');
  console.log('\nChoose an option by editing this script and running it again.');
  console.log('Or follow the manual steps below:\n');
  
  console.log('🔧 MANUAL SETUP STEPS:');
  console.log('======================');
  console.log('1. Go to your email provider:');
  console.log('   - Gmail: https://myaccount.google.com/security');
  console.log('   - Outlook: https://account.microsoft.com/security');
  console.log('   - Yahoo: https://login.yahoo.com/account/security');
  console.log('');
  console.log('2. Enable 2-Factor Authentication');
  console.log('3. Generate an App Password for Mail');
  console.log('4. Update your .env file with the new credentials');
  console.log('5. Restart your server');
  console.log('');
  console.log('📝 Current .env settings:');
  console.log('EMAIL_USER=ziyinab00@gmail.com');
  console.log('EMAIL_PASS=zjjc yqaf wpzq jokm');
  console.log('');
  console.log('🔄 After updating, restart your server with: node server.js');
  
  // Test current setup
  const currentWorks = await testCurrent();
  
  if (!currentWorks) {
    console.log('\n❌ Current setup is not working.');
    console.log('Please follow the manual steps above to fix it.');
  }
}

main().catch(console.error);
