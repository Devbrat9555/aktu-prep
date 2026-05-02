const mongoose = require('mongoose');
const codingController = require('./controllers/codingController');
require('dotenv').config();

const forceSync = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB. Starting Force Sync...");
        
        const count = await codingController.syncTelegramVideosInternal();
        console.log(`Successfully synced ${count} videos.`);
        
        process.exit(0);
    } catch (err) {
        console.error("Force Sync Failed:", err);
        process.exit(1);
    }
};

forceSync();
