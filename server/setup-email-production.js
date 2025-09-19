const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🎯 ===== MoezBinz Production Email Setup =====');
console.log('This will help you set up real email sending for production.\n');

console.log('📧 Email Service Options:');
console.log('1. Gmail (requires App Password)');
console.log('2. Outlook/Hotmail');
console.log('3. Custom SMTP Server');
console.log('4. Skip setup (use mock emails)\n');

rl.question('Choose an option (1-4): ', (option) => {
  switch (option.trim()) {
    case '1':
      setupGmail();
      break;
    case '2':
      setupOutlook();
      break;
    case '3':
      setupCustomSMTP();
      break;
    case '4':
      console.log('✅ Skipped email setup. Mock emails will be used.');
      rl.close();
      break;
    default:
      console.log('❌ Invalid option. Please run the script again.');
      rl.close();
  }
});

function setupGmail() {
  console.log('\n📧 Gmail Setup:');
  console.log('1. Enable 2-factor authentication on your Gmail account');
  console.log('2. Generate an App Password:');
  console.log('   - Go to Google Account settings');
  console.log('   - Security → 2-Step Verification → App passwords');
  console.log('   - Generate a password for "Mail"\n');

  rl.question('Enter your Gmail address: ', (email) => {
    if (!email.trim() || !email.includes('@gmail.com')) {
      console.log('❌ Invalid Gmail address.');
      rl.close();
      return;
    }

    rl.question('Enter your Gmail App Password: ', (password) => {
      if (!password.trim()) {
        console.log('❌ No password provided.');
        rl.close();
        return;
      }

      updateEnvFile(email, password);
    });
  });
}

function setupOutlook() {
  console.log('\n📧 Outlook/Hotmail Setup:');
  console.log('1. Enable 2-factor authentication on your Outlook account');
  console.log('2. Generate an App Password:');
  console.log('   - Go to Microsoft Account security settings');
  console.log('   - Advanced security options → App passwords');
  console.log('   - Generate a password for "Mail"\n');

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

  // Update or add email credentials
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
    console.log('🔄 Please restart your server to use real email sending.');
    console.log('📧 Test by requesting a password reset from the frontend.');
    console.log('\n💡 If emails still don\'t work, check:');
    console.log('   - 2-factor authentication is enabled');
    console.log('   - App password is correct');
    console.log('   - Less secure app access is enabled (if required)');
  } catch (error) {
    console.log('❌ Could not save email credentials:', error.message);
  }
  
  rl.close();
}

rl.on('close', () => {
  console.log('\n🎯 Setup complete! Happy treasure hunting! 🏴‍☠️');
});
