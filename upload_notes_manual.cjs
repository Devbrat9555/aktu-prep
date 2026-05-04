const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const SERVER_URL = 'https://aktu-prep.onrender.com/api/admin/notes/bulk-sync';
const ADMIN_EMAIL = 'vrat1087@gmail.com';
const NOTES_DIR = path.join(__dirname, 'public/notes');

async function walk(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            await walk(filePath, fileList);
        } else if (file.endsWith('.pdf')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

async function uploadWithRetry(filePath, relativePath, retries = 3) {
    for (let i = 0; i < retries; i++) {
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
                maxBodyLength: Infinity,
                timeout: 180000 // 3 minute timeout
            });
            const logMsg = `[SUCCESS] ${new Date().toLocaleTimeString()} - ${relativePath}\n`;
            console.log(logMsg.trim());
            fs.appendFileSync('sync_progress.txt', logMsg);
            return true;
        } catch (error) {
            const isLastRetry = i === retries - 1;
            const errorMsg = error.response?.status === 502 ? 'Server Overloaded (502)' : error.message;
            
            if (isLastRetry) {
                const logError = `[FATAL] ${relativePath}: ${errorMsg} after ${retries} attempts\n`;
                console.error(logError.trim());
                fs.appendFileSync('sync_progress.txt', logError);
            } else {
                console.log(`[RETRYING ${i+1}/${retries}] ${relativePath}: ${errorMsg}`);
                await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3s before retry
            }
        }
    }
    return false;
}

async function main() {
    console.log('--- STARTING ROBUST CORE DATA INJECTION ---');
    if (!fs.existsSync(NOTES_DIR)) {
        console.error('Notes directory not found!');
        return;
    }

    const allFiles = await walk(NOTES_DIR);
    console.log(`Found ${allFiles.length} PDF files. Starting upload with retry logic...`);

    const total = allFiles.length;
    let completed = 0;

    for (const filePath of allFiles) {
        const relativePath = path.relative(path.join(__dirname, 'public'), filePath).replace(/\\/g, '/');
        
        const success = await uploadWithRetry(filePath, relativePath);
        completed++;
        
        if (completed % 5 === 0) {
            console.log(`Overall Progress: ${completed}/${total} (${((completed/total)*100).toFixed(1)}%)`);
        }
        
        // Safety delay
        await new Promise(resolve => setTimeout(resolve, 800));
    }

    console.log('--- ROBUST DATA INJECTION COMPLETE ---');
}

main();
