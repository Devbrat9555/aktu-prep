const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Subject = require('./models/Subject');
const StudyMaterial = require('./models/StudyMaterial');

async function reportUnits() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const subjects = await Subject.find({ course: 'B.Tech' }).sort({ semester: 1 });
        
        console.log('AKTU UNIT COVERAGE REPORT');
        console.log('=========================');

        for (const sub of subjects) {
            const units = await StudyMaterial.distinct('unit', { subjectId: sub._id });
            const presentUnits = units.filter(u => u >= 1 && u <= 5);
            const missing = [1, 2, 3, 4, 5].filter(u => !presentUnits.includes(u));
            
            if (missing.length > 0) {
                console.log(`[Sem ${sub.semester}] ${sub.name}: Missing Units ${missing.join(', ')}`);
            }
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

reportUnits();
