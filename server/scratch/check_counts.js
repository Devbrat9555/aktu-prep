const mongoose = require('mongoose');
const StudyMaterial = require('../models/StudyMaterial');
const Subject = require('../models/Subject');
require('dotenv').config({ path: '../.env' });

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const subjects = await Subject.find({ course: 'Coding' });
        for (const sub of subjects) {
            const count = await StudyMaterial.countDocuments({ subjectId: sub._id });
            console.log(`${sub.name}: ${count} materials`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}
check();
