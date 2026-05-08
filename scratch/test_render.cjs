const axios = require('axios');

async function testBackend() {
    const url = 'https://aktu-prep.onrender.com/api/courses';
    console.log(`🔍 Checking Render Backend: ${url}`);
    
    try {
        const start = Date.now();
        const response = await axios.get(url, { timeout: 30000 });
        const end = Date.now();
        console.log('✅ Backend is ONLINE!');
        console.log(`⏱️ Response Time: ${end - start}ms`);
        console.log(`📦 Data Count: ${response.data.length} courses`);
    } catch (err) {
        if (err.code === 'ECONNABORTED') {
            console.log('⏳ Backend is taking too long (Cold Start). Try again in 30 seconds.');
        } else {
            console.log('❌ Backend Error:', err.message);
            if (err.response) {
                console.log('Status:', err.response.status);
            }
        }
    }
}

testBackend();
