const readline = require('readline');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🎯 ===== MoezBinz Real Email Setup =====');
console.log('Let\'s get real emails working for your forgot password feature!\n');

console.log('📧 Email Service Options:');
console.log('1. Gmail (fix current setup)');
console.log('2. Outlook/Hotmail');
console.log('3. Yahoo Mail');
console.log('4. Custom SMTP Server');
console.log('5. Professional Email Service (SendGrid, Mailgun, etc.)');
console.log('6. Test current setup\n');

rl.question('Choose an option (1-6): ', (option) => {
  switch (option.trim()) {
    case '1':
      fixGmailSetup();
      break;
    case '2':
      setupOutlook();
      break;
    case '3':
      setupYahoo();
      break;
    case '4':
      setupCustomSMTP();
      break;
    case '5':
      setupProfessionalService();
      break;
    case '6':
      testCurrentSetup();
      break;
    default:
      console.log('❌ Invalid option. Please run the script again.');
      rl.close();
  }
});

async function testCurrentSetup() {
  console.log('\n🧪 Testing current email setup...');
  
  try {
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
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
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: '🧪 MoezBinz Email Test',
      html: `
        <h2>🎉 Email Test Successful!</h2>
        <p>Your MoezBinz email service is working correctly.</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      `
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📬 Check your inbox for the test email.');
    
  } catch (error) {
    console.log('❌ Email test failed:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n🔧 Gmail App Password Issues:');
      console.log('1. Make sure 2-factor authentication is enabled');
      console.log('2. Generate a new App Password:');
      console.log('   - Go to Google Account settings');
      console.log('   - Security → 2-Step Verification → App passwords');
      console.log('   - Delete old app password and create new one');
      console.log('   - Use the new 16-character password (no spaces)');
      console.log('3. Make sure "Less secure app access" is disabled (use App Password instead)');
    }
  }
  
  rl.close();
}

function fixGmailSetup() {
  console.log('\n🔧 Gmail Setup Fix:');
  console.log('The current Gmail app password is not working. Let\'s fix it:\n');
  
  console.log('📋 Steps to fix Gmail:');
  console.log('1. Go to https://myaccount.google.com/security');
  console.log('2. Enable 2-Factor Authentication if not already enabled');
  console.log('3. Go to "App passwords" section');
  console.log('4. Delete any existing "Mail" app passwords');
  console.log('5. Create a new "Mail" app password');
  console.log('6. Copy the 16-character password (no spaces)\n');
  
  rl.question('Enter your Gmail address: ', (email) => {
    if (!email.trim() || !email.includes('@gmail.com')) {
      console.log('❌ Invalid Gmail address.');
      rl.close();
      return;
    }

    rl.question('Enter your NEW Gmail App Password (16 characters, no spaces): ', (password) => {
      if (!password.trim() || password.length !== 16) {
        console.log('❌ App password should be 16 characters long.');
        rl.close();
        return;
      }

      updateEnvFile(email, password);
    });
  });
}

function setupOutlook() {
  console.log('\n📧 Outlook/Hotmail Setup:');
  console.log('1. Go to https://account.microsoft.com/security');
  console.log('2. Enable 2-factor authentication');
  console.log('3. Go to "Advanced security options"');
  console.log('4. Create a new "App password" for Mail\n');

  rl.question('Enter your Outlook/Hotmail address: ', (email) => {
    if (!email.trim() || (!email.includes('@outlook.com') && !email.includes('@hotmail.com'))) {
      console.log('❌ Invalid Outlook/Hotmail address.');
      rl.close();
      return;
    }

    rl.question('Enter your App Password: ', (password) => {
      if (!password.trim()) {
        console.log('❌ No password provided.');
        rl.close();
        return;
      }

      updateEnvFile(email, password);
    });
  });
}

function setupYahoo() {
  console.log('\n📧 Yahoo Mail Setup:');
  console.log('1. Go to https://login.yahoo.com/account/security');
  console.log('2. Enable 2-factor authentication');
  console.log('3. Go to "Generate app password"');
  console.log('4. Create a new app password for "Mail"\n');

  rl.question('Enter your Yahoo email address: ', (email) => {
    if (!email.trim() || !email.includes('@yahoo.com')) {
      console.log('❌ Invalid Yahoo address.');
      rl.close();
      return;
    }

    rl.question('Enter your App Password: ', (password) => {
      if (!password.trim()) {
        console.log('❌ No password provided.');
        rl.close();
        return;
      }

      updateEnvFile(email, password);
    });
  });
}

function setupCustomSMTP() {
  console.log('\n📧 Custom SMTP Setup:\n');

  rl.question('Enter your email address: ', (email) => {
    if (!email.trim()) {
      console.log('❌ No email provided.');
      rl.close();
      return;
    }

    rl.question('Enter your email password: ', (password) => {
      if (!password.trim()) {
        console.log('❌ No password provided.');
        rl.close();
        return;
      }

      rl.question('Enter SMTP host (e.g., smtp.gmail.com): ', (host) => {
        if (!host.trim()) {
          console.log('❌ No SMTP host provided.');
          rl.close();
          return;
        }

        rl.question('Enter SMTP port (default 587): ', (port) => {
          const smtpPort = port.trim() || '587';
          updateEnvFile(email, password, host, smtpPort);
        });
      });
    });
  });
}

function setupProfessionalService() {
  console.log('\n📧 Professional Email Service Setup:');
  console.log('For production, consider using:');
  console.log('1. SendGrid (free tier: 100 emails/day)');
  console.log('2. Mailgun (free tier: 5,000 emails/month)');
  console.log('3. AWS SES (very cheap, pay per email)');
  console.log('4. Postmark (reliable, good for transactional emails)\n');
  
  console.log('These services are more reliable than Gmail for production use.');
  console.log('Would you like to continue with Gmail for now? (y/n)');
  
  rl.question('', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      fixGmailSetup();
    } else {
      console.log('✅ You can set up a professional service later.');
      rl.close();
    }
  });
}

function updateEnvFile(email, password, host = null, port = null) {
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
  let smtpHostUpdated = false;
  let smtpPortUpdated = false;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('EMAIL_USER=')) {
      lines[i] = `EMAIL_USER=${email}`;
      emailUserUpdated = true;
    } else if (lines[i].startsWith('EMAIL_PASS=')) {
      lines[i] = `EMAIL_PASS=${password}`;
      emailPassUpdated = true;
    } else if (lines[i].startsWith('SMTP_HOST=')) {
      lines[i] = `SMTP_HOST=${host || ''}`;
      smtpHostUpdated = true;
    } else if (lines[i].startsWith('SMTP_PORT=')) {
      lines[i] = `SMTP_PORT=${port || ''}`;
      smtpPortUpdated = true;
    }
  }
  
  // Add missing lines
  if (!emailUserUpdated) {
    lines.push(`EMAIL_USER=${email}`);
  }
  if (!emailPassUpdated) {
    lines.push(`EMAIL_PASS=${password}`);
  }
  if (host && !smtpHostUpdated) {
    lines.push(`SMTP_HOST=${host}`);
  }
  if (port && !smtpPortUpdated) {
    lines.push(`SMTP_PORT=${port}`);
  }
  
  try {
    fs.writeFileSync(envPath, lines.join('\n'));
    console.log('\n✅ Email credentials saved successfully!');
    console.log('🔄 Please restart your server to use the new credentials.');
    console.log('📧 Test by requesting a password reset from the frontend.');
    
    // Test the new credentials
    console.log('\n🧪 Testing new credentials...');
    testNewCredentials(email, password, host, port);
    
  } catch (error) {
    console.log('❌ Could not save email credentials:', error.message);
  }
}

async function testNewCredentials(email, password, host, port) {
  try {
    let transporter;
    
    if (host && port) {
      // Custom SMTP
      transporter = nodemailer.createTransporter({
        host: host,
        port: parseInt(port),
        secure: port === '465',
        auth: {
          user: email,
          pass: password
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    } else if (email.includes('@gmail.com')) {
      // Gmail
      transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: email,
          pass: password
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    } else if (email.includes('@outlook.com') || email.includes('@hotmail.com')) {
      // Outlook
      transporter = nodemailer.createTransporter({
        service: 'hotmail',
        auth: {
          user: email,
          pass: password
        }
      });
    } else if (email.includes('@yahoo.com')) {
      // Yahoo
      transporter = nodemailer.createTransporter({
        service: 'yahoo',
        auth: {
          user: email,
          pass: password
        }
      });
    } else {
      console.log('❌ Unsupported email provider. Please use Gmail, Outlook, or Yahoo.');
      rl.close();
      return;
    }

    console.log('📧 Testing connection...');
    await transporter.verify();
    console.log('✅ Connection successful!');
    
    console.log('📧 Sending test email...');
    const result = await transporter.sendMail({
      from: email,
      to: email, // Send to yourself
      subject: '🎉 MoezBinz Email Test - SUCCESS!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
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
    console.log('\n🎯 Your forgot password feature is now ready to send real emails!');
    
  } catch (error) {
    console.log('❌ Email test failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Double-check your email and password');
    console.log('2. Make sure 2-factor authentication is enabled');
    console.log('3. Generate a fresh app password');
    console.log('4. Try a different email provider');
  }
  
  rl.close();
}

rl.on('close', () => {
  console.log('\n🎯 Email setup complete! Happy treasure hunting! 🏴‍☠️');
});
