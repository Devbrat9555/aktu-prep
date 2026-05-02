const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { syncTelegramVideosInternal } = require('./controllers/codingController');

async function triggerSync() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB...');
        
        console.log('Starting Manual Sync...');
        await syncTelegramVideosInternal();
        console.log('Sync complete!');
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

triggerSync();
