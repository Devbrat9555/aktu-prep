const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Subject = require('./models/Subject');
const StudyMaterial = require('./models/StudyMaterial');

async function checkCounts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const subjects = await Subject.find({ course: 'Coding' });
        
        for (const sub of subjects) {
            const count = await StudyMaterial.countDocuments({ subjectId: sub._id });
            console.log(`${sub.name}: ${count} videos`);
        }
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkCounts();
