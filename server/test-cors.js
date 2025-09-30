const axios = require('axios');

// Test CORS configuration
async function testCORS() {
  const testOrigins = [
    'https://thebinzstore.vercel.app',
    'https://moez-binz-sepia.vercel.app',
    'http://localhost:5173'
  ];

  const serverUrl = process.env.SERVER_URL || 'https://moezbinz.onrender.com';
  
  console.log('Testing CORS configuration...');
  console.log('Server URL:', serverUrl);
  console.log('');

  for (const origin of testOrigins) {
    try {
      console.log(`Testing origin: ${origin}`);
      
      // Test OPTIONS preflight request
      const optionsResponse = await axios.options(`${serverUrl}/api/health`, {
        headers: {
          'Origin': origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      
      console.log(`✅ OPTIONS request successful for ${origin}`);
      console.log(`   Status: ${optionsResponse.status}`);
      console.log(`   CORS Headers:`, {
        'Access-Control-Allow-Origin': optionsResponse.headers['access-control-allow-origin'],
        'Access-Control-Allow-Methods': optionsResponse.headers['access-control-allow-methods'],
        'Access-Control-Allow-Headers': optionsResponse.headers['access-control-allow-headers'],
        'Access-Control-Allow-Credentials': optionsResponse.headers['access-control-allow-credentials']
      });
      
      // Test actual GET request
      const getResponse = await axios.get(`${serverUrl}/api/health`, {
        headers: {
          'Origin': origin
        }
      });
      
      console.log(`✅ GET request successful for ${origin}`);
      console.log(`   Status: ${getResponse.status}`);
      console.log(`   Response:`, getResponse.data);
      
    } catch (error) {
      console.log(`❌ Request failed for ${origin}`);
      console.log(`   Error:`, error.message);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Headers:`, error.response.headers);
      }
    }
    
    console.log('---');
  }
}

// Run the test
testCORS().catch(console.error);
