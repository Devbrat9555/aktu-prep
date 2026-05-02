const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Subject = require('./models/Subject');

async function fixNames() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB...');

        const result = await Subject.updateMany(
            { name: 'Supreme DSA', course: 'Coding' },
            { $set: { name: 'DSA Supreme Batch' } }
        );
        console.log(`Updated ${result.nModified || result.modifiedCount} subjects.`);

        // Also ensure the new subject exists if it didn't before
        const exists = await Subject.findOne({ name: 'DSA Supreme Batch', course: 'Coding' });
        if (!exists) {
            console.log('Creating DSA Supreme Batch subject...');
            await new Subject({
                name: 'DSA Supreme Batch',
                course: 'Coding',
                year: 1,
                semester: 1
            }).save();
        }

        console.log('Done!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixNames();
