const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Subject = require('./models/Subject');

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const updates = [
            { old: 'DSA Supreme Batch', new: 'PW Web Dev' },
            { old: 'Delta Batch 6.0', new: 'Rohit Negi Web Dev' },
            { old: 'Rohit Negi Batch', new: 'Rohit Negi Web Dev' }
        ];

        for (const update of updates) {
            const res = await Subject.updateMany(
                { name: update.old, course: 'Coding' },
                { $set: { name: update.new } }
            );
            console.log(`Updated ${update.old} to ${update.new}: ${res.modifiedCount} matches`);
        }
        
        console.log('Migration complete');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();
