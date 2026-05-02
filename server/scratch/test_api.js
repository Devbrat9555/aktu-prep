const http = require('http');

http.get('http://localhost:5000/api/coding', (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
        try {
            const j = JSON.parse(d);
            console.log('success:', j.success);
            console.log('has data:', !!j.data);
            console.log('has resources:', !!j.resources);
            console.log('keys:', Object.keys(j));
            if (j.data) {
                console.log('data keys:', Object.keys(j.data));
                Object.keys(j.data).forEach(k => {
                    console.log(`  ${k}: ${j.data[k].length} items`);
                });
            }
        } catch (e) {
            console.log('Parse error:', e.message);
            console.log('Raw:', d.substring(0, 500));
        }
    });
}).on('error', e => console.log('Connection error:', e.message));
