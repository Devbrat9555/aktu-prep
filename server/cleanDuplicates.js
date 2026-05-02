const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const StudyMaterial = require('./models/StudyMaterial');

const cleanDuplicates = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB for cleanup...');

        const materials = await StudyMaterial.find({});
        console.log(`Found ${materials.length} total materials.`);

        let deletedCount = 0;
        const seen = new Set();

        // Sort by date descending so we keep the newest ones first
        materials.sort((a, b) => b.createdAt - a.createdAt);

        for (const m of materials) {
            const key = `${m.subjectId}-${m.title}`;
            
            // Delete if it has the typo 'notees' or if we've already seen this subject+title combo
            if (m.url.includes('/notees/') || seen.has(key)) {
                await StudyMaterial.findByIdAndDelete(m._id);
                deletedCount++;
            } else {
                seen.add(key);
            }
        }

        console.log(`Cleanup complete! Removed ${deletedCount} duplicate entries.`);
        process.exit();
    } catch (err) {
        console.error('Cleanup error:', err);
        process.exit(1);
    }
};

cleanDuplicates();
