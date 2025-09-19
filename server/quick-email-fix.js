const readline = require('readline');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🎯 Quick Email Fix for MoezBinz');
console.log('Let\'s get real emails working right now!\n');

console.log('📧 Email Options:');
console.log('1. Fix Gmail (try new app password)');
console.log('2. Use Outlook/Hotmail (often more reliable)');
console.log('3. Use Yahoo Mail');
console.log('4. Test current setup\n');

rl.question('Choose option (1-4): ', (option) => {
  switch (option.trim()) {
    case '1':
      fixGmail();
      break;
    case '2':
      setupOutlook();
      break;
    case '3':
      setupYahoo();
      break;
    case '4':
      testCurrent();
      break;
    default:
      console.log('❌ Invalid option.');
      rl.close();
  }
});

async function testCurrent() {
  console.log('\n🧪 Testing current setup...');
  
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: { rejectUnauthorized: false }
    });

    await transporter.verify();
    console.log('✅ Current Gmail setup is working!');
    
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: '🎉 MoezBinz Test Email',
      html: '<h2>Email is working!</h2>'
    });
    
    console.log('✅ Test email sent! Message ID:', result.messageId);
    
  } catch (error) {
    console.log('❌ Current setup failed:', error.message);
    console.log('\n🔧 The Gmail app password needs to be updated.');
  }
  
  rl.close();
}

function fixGmail() {
  console.log('\n🔧 Gmail Fix Instructions:');
  console.log('1. Go to: https://myaccount.google.com/security');
  console.log('2. Enable 2-Factor Authentication');
  console.log('3. Go to "App passwords"');
  console.log('4. Delete old "Mail" password');
  console.log('5. Create NEW "Mail" password');
  console.log('6. Copy the 16-character password\n');
  
  rl.question('Enter your Gmail address: ', (email) => {
    rl.question('Enter your NEW 16-character app password: ', (password) => {
      if (password.length !== 16) {
        console.log('❌ App password must be 16 characters.');
        rl.close();
        return;
      }
      
      testAndUpdate(email, password);
    });
  });
}

function setupOutlook() {
  console.log('\n📧 Outlook Setup (Recommended - more reliable):');
  console.log('1. Go to: https://account.microsoft.com/security');
  console.log('2. Enable 2-factor authentication');
  console.log('3. Go to "Advanced security options"');
  console.log('4. Create "App password" for Mail\n');
  
  rl.question('Enter your Outlook/Hotmail address: ', (email) => {
    rl.question('Enter your App Password: ', (password) => {
      testAndUpdate(email, password, 'outlook');
    });
  });
}

function setupYahoo() {
  console.log('\n📧 Yahoo Setup:');
  console.log('1. Go to: https://login.yahoo.com/account/security');
  console.log('2. Enable 2-factor authentication');
  console.log('3. Go to "Generate app password"');
  console.log('4. Create app password for Mail\n');
  
  rl.question('Enter your Yahoo email: ', (email) => {
    rl.question('Enter your App Password: ', (password) => {
      testAndUpdate(email, password, 'yahoo');
    });
  });
}

async function testAndUpdate(email, password, service = 'gmail') {
  console.log('\n🧪 Testing new credentials...');
  
  try {
    let transporter;
    
    if (service === 'outlook') {
      transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: { user: email, pass: password }
      });
    } else if (service === 'yahoo') {
      transporter = nodemailer.createTransport({
        service: 'yahoo',
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
    
    // Update .env file
    updateEnvFile(email, password);
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    console.log('\n🔧 Please check your credentials and try again.');
  }
  
  rl.close();
}

function updateEnvFile(email, password) {
  const envPath = path.join(__dirname, '.env');
  let envContent = '';
  
  try {
    envContent = fs.readFileSync(envPath, 'utf8');
  } catch (error) {
    console.log('❌ Could not read .env file');
    return;
  }

  const lines = envContent.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('EMAIL_USER=')) {
      lines[i] = `EMAIL_USER=${email}`;
    } else if (lines[i].startsWith('EMAIL_PASS=')) {
      lines[i] = `EMAIL_PASS=${password}`;
    }
  }
  
  try {
    fs.writeFileSync(envPath, lines.join('\n'));
    console.log('\n✅ Email credentials updated!');
    console.log('🔄 Restart your server to use new credentials.');
    console.log('📧 Your forgot password will now send real emails!');
  } catch (error) {
    console.log('❌ Could not save credentials:', error.message);
  }
}

rl.on('close', () => {
  console.log('\n🎯 Email setup complete! 🏴‍☠️');
});
