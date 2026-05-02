const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Subject = require('./models/Subject');
const StudyMaterial = require('./models/StudyMaterial');

const purgeAndSync = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- CRITICAL: PURGING B.TECH SUBJECTS FOR CLEAN STATE ---');
        
        // 1. Delete all study materials for B.Tech subjects
        const subjects = await Subject.find({ course: 'B.Tech' });
        const subjectIds = subjects.map(s => s._id);
        
        await StudyMaterial.deleteMany({ subjectId: { $in: subjectIds } });
        console.log('Deleted all materials for B.Tech subjects.');

        // 2. Delete the subjects themselves
        await Subject.deleteMany({ course: 'B.Tech' });
        console.log('Deleted all B.Tech subjects.');

        console.log('--- PURGE COMPLETE. READY FOR CLEAN IMPORT. ---');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

purgeAndSync();
