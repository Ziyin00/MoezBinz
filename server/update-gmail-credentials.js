const readline = require('readline');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔧 Gmail Credentials Update');
console.log('Let\'s fix your Gmail app password!\n');

console.log('📋 Before we start, make sure you have:');
console.log('1. ✅ 2-Factor Authentication enabled on Gmail');
console.log('2. ✅ Generated a NEW App Password (16 characters)');
console.log('3. ✅ Copied the password (no spaces)\n');

rl.question('Enter your Gmail address (Thebinzstore23@gmail.com): ', (email) => {
  const gmailAddress = email.trim() || 'Thebinzstore23@gmail.com';
  
  if (!gmailAddress.includes('@gmail.com')) {
    console.log('❌ Please enter a valid Gmail address.');
    rl.close();
    return;
  }

  rl.question('Enter your NEW Gmail App Password (16 characters, no spaces): ', (password) => {
    if (!password.trim()) {
      console.log('❌ No password provided.');
      rl.close();
      return;
    }

    if (password.length !== 16) {
      console.log('❌ App password should be exactly 16 characters long.');
      console.log('Current length:', password.length);
      rl.close();
      return;
    }

    // Test the credentials first
    testCredentials(gmailAddress, password);
  });
});

async function testCredentials(email, password) {
  console.log('\n🧪 Testing new Gmail credentials...');
  
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('📧 Testing connection...');
    await transporter.verify();
    console.log('✅ Connection successful!');
    
    console.log('📧 Sending test email...');
    const result = await transporter.sendMail({
      from: email,
      to: email, // Send to yourself
      subject: '🎉 MoezBinz Email Test - SUCCESS!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #dc2626;">🎉 Email Test Successful!</h2>
          <p>Your MoezBinz email service is now working correctly!</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>From:</strong> ${email}</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 14px;">
            This test email confirms that your forgot password feature will now send real emails.
          </p>
        </div>
      `
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📬 Check your inbox for the test email.');
    
    // If test successful, update the .env file
    updateEnvFile(email, password);
    
  } catch (error) {
    console.log('❌ Email test failed:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n🔧 The app password is still not working. Please check:');
      console.log('1. ✅ 2-Factor Authentication is enabled');
      console.log('2. ✅ You generated a NEW app password (not the old one)');
      console.log('3. ✅ You copied the password correctly (16 characters, no spaces)');
      console.log('4. ✅ You selected "Mail" as the app type');
      console.log('\nTry generating a new app password and run this script again.');
    } else {
      console.log('\n🔧 Other error:', error.message);
    }
    
    rl.close();
  }
}

function updateEnvFile(email, password) {
  const envPath = path.join(__dirname, '.env');
  let envContent = '';
  
  try {
    envContent = fs.readFileSync(envPath, 'utf8');
  } catch (error) {
    console.log('❌ Could not read .env file');
    rl.close();
    return;
  }

  // Update email credentials
  const lines = envContent.split('\n');
  let emailUserUpdated = false;
  let emailPassUpdated = false;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('EMAIL_USER=')) {
      lines[i] = `EMAIL_USER=${email}`;
      emailUserUpdated = true;
    } else if (lines[i].startsWith('EMAIL_PASS=')) {
      lines[i] = `EMAIL_PASS=${password}`;
      emailPassUpdated = true;
    }
  }
  
  // Add missing lines
  if (!emailUserUpdated) {
    lines.push(`EMAIL_USER=${email}`);
  }
  if (!emailPassUpdated) {
    lines.push(`EMAIL_PASS=${password}`);
  }
  
  try {
    fs.writeFileSync(envPath, lines.join('\n'));
    console.log('\n✅ Email credentials updated successfully!');
    console.log('🔄 Please restart your server to use the new credentials.');
    console.log('📧 Your forgot password feature will now send real emails!');
    
    console.log('\n🎯 Next steps:');
    console.log('1. Restart your server (Ctrl+C and run "node server.js" again)');
    console.log('2. Test the forgot password feature from your frontend');
    console.log('3. Check your email inbox for the reset link');
    
  } catch (error) {
    console.log('❌ Could not save email credentials:', error.message);
  }
  
  rl.close();
}

rl.on('close', () => {
  console.log('\n🎯 Gmail setup complete! Happy treasure hunting! 🏴‍☠️');
});
