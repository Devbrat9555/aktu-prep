const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Subject = require('./models/Subject');
const StudyMaterial = require('./models/StudyMaterial');

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // 1. Rename PW Web Dev -> Supreme DSA
        const res1 = await Subject.updateOne(
            { name: 'PW Web Dev', course: 'Coding' },
            { $set: { name: 'Supreme DSA' } }
        );
        console.log(`Renamed PW Web Dev to Supreme DSA: ${res1.modifiedCount} matches`);

        // 2. Delete DSA Essentials
        const ess = await Subject.findOne({ name: 'DSA Essentials', course: 'Coding' });
        if (ess) {
            const res2 = await StudyMaterial.deleteMany({ subjectId: ess._id });
            const res3 = await Subject.deleteOne({ _id: ess._id });
            console.log(`Deleted DSA Essentials: ${res2.deletedCount} materials, ${res3.deletedCount} subjects`);
        }
        
        console.log('Migration complete');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();
