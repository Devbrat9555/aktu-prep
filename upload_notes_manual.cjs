const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const SERVER_URL = 'https://aktu-prep.onrender.com/api/admin/notes/bulk-sync-raw';
const ADMIN_EMAIL = 'vrat1087@gmail.com';
const NOTES_DIR = path.join(__dirname, 'public/notes');

async function uploadFile(filePath, relativePath) {
    try {
        const formData = new FormData();
        formData.append('files', fs.createReadStream(filePath));
        formData.append('paths', relativePath);

        const response = await axios.post(SERVER_URL, formData, {
            headers: {
                ...formData.getHeaders(),
                'x-admin-email': ADMIN_EMAIL
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });
        console.log(`[SUCCESS] ${relativePath}: ${response.data.message}`);
    } catch (error) {
        console.error(`[FAILED] ${relativePath}:`, error.response?.data || error.message);
    }
}

async function walk(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            walk(filePath, fileList);
        } else if (file.endsWith('.pdf')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

async function main() {
    console.log('--- STARTING MANUAL CORE DATA INJECTION ---');
    if (!fs.existsSync(NOTES_DIR)) {
        console.error('Notes directory not found!');
        return;
    }

    const allFiles = await walk(NOTES_DIR);
    console.log(`Found ${allFiles.length} PDF files. Starting upload...`);

    for (const filePath of allFiles) {
        const relativePath = path.relative(path.join(__dirname, 'public'), filePath).replace(/\\/g, '/');
        await uploadFile(filePath, relativePath);
        // Small delay to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('--- DATA INJECTION COMPLETE ---');
}

main();
