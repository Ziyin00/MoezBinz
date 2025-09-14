const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🎯 ===== MoezBinz Email Setup =====');
console.log('This will help you set up real email sending for password reset.\n');

console.log('📧 To use Gmail for sending emails:');
console.log('1. Enable 2-factor authentication on your Gmail account');
console.log('2. Generate an App Password:');
console.log('   - Go to Google Account settings');
console.log('   - Security → 2-Step Verification → App passwords');
console.log('   - Generate a password for "Mail"\n');

rl.question('Enter your Gmail address (or press Enter to skip): ', (email) => {
  if (!email.trim()) {
    console.log('✅ Skipped email setup. Mock emails will be used.');
    rl.close();
    return;
  }

  rl.question('Enter your Gmail App Password: ', (password) => {
    if (!password.trim()) {
      console.log('❌ No password provided. Mock emails will be used.');
      rl.close();
      return;
    }

    // Update .env file
    const fs = require('fs');
    const path = require('path');
    
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
    let updated = false;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('EMAIL_USER=')) {
        lines[i] = `EMAIL_USER=${email}`;
        updated = true;
      } else if (lines[i].startsWith('EMAIL_PASS=')) {
        lines[i] = `EMAIL_PASS=${password}`;
        updated = true;
      }
    }
    
    if (!updated) {
      lines.push(`EMAIL_USER=${email}`);
      lines.push(`EMAIL_PASS=${password}`);
    }
    
    try {
      fs.writeFileSync(envPath, lines.join('\n'));
      console.log('\n✅ Email credentials saved successfully!');
      console.log('🔄 Please restart your server to use real email sending.');
      console.log('📧 Test by requesting a password reset from the frontend.');
    } catch (error) {
      console.log('❌ Could not save email credentials:', error.message);
    }
    
    rl.close();
  });
});

rl.on('close', () => {
  console.log('\n🎯 Setup complete! Happy treasure hunting! 🏴‍☠️');
});
