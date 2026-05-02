// Tests time-to-first-byte for video streaming through Vite proxy
const http = require('http');

const start = Date.now();
console.log('Starting video stream test...');

const req = http.get({
    hostname: 'localhost',
    port: 5173,
    path: '/api/coding/stream/409',
    headers: { Range: 'bytes=0-524287' }
}, (res) => {
    const headerTime = Date.now() - start;
    console.log(`Headers received in ${headerTime}ms (Status: ${res.statusCode})`);
    console.log(`Content-Range: ${res.headers['content-range']}`);
    console.log(`Content-Length: ${res.headers['content-length']}`);
    
    let bytes = 0;
    let firstByteTime = 0;
    
    res.on('data', (chunk) => {
        bytes += chunk.length;
        if (!firstByteTime) {
            firstByteTime = Date.now() - start;
            console.log(`First byte at ${firstByteTime}ms`);
        }
    });
    
    res.on('end', () => {
        const total = Date.now() - start;
        console.log(`Complete: ${bytes} bytes in ${total}ms`);
        console.log(`\n=== VERDICT ===`);
        if (firstByteTime < 5000) {
            console.log(`✅ FAST! First byte in ${firstByteTime}ms (target: <5000ms)`);
        } else if (firstByteTime < 10000) {
            console.log(`⚠️ OK. First byte in ${firstByteTime}ms (target: <5000ms)`);
        } else {
            console.log(`❌ SLOW. First byte in ${firstByteTime}ms (target: <5000ms)`);
        }
        process.exit(0);
    });
});

req.on('error', (e) => {
    console.log('Error:', e.message);
    process.exit(1);
});

// Timeout after 30s
setTimeout(() => { console.log('TIMEOUT after 30s'); process.exit(1); }, 30000);
