const https = require('https');

const API_KEY = 'AIzaSyCIGpPsOL5FKbkVH1g2kavGdXuXO0bpM3s';
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const data = JSON.stringify({
  contents: [{
    parts: [{
      text: "Say hello"
    }]
  }]
});

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(url, options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log(JSON.stringify(JSON.parse(body), null, 2));
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.write(data);
req.end();
