const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Subject = require('./models/Subject');

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // 1. Rename Dot Batch -> Dot Web Dev
        await Subject.updateOne(
            { name: 'Dot Batch', course: 'Coding' },
            { $set: { name: 'Dot Web Dev' } }
        );

        // 2. Ensure all 4 exist
        const names = ['PW Web Dev', 'Rohit Negi Web Dev', 'Dot Web Dev', 'Supreme DSA'];
        for (const name of names) {
            const sub = await Subject.findOne({ name, course: 'Coding' });
            if (!sub) {
                await new Subject({
                    name,
                    course: 'Coding',
                    year: 0,
                    semester: 0
                }).save();
                console.log(`Created subject: ${name}`);
            } else {
                console.log(`Subject exists: ${name}`);
            }
        }
        
        console.log('Migration complete');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();
