const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Subject = require('./models/Subject');
const StudyMaterial = require('./models/StudyMaterial');

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);
    const subjects = await Subject.countDocuments();
    const materials = await StudyMaterial.countDocuments();
    console.log(`--- LIVE STATS ---`);
    console.log(`Total Subjects: ${subjects}`);
    console.log(`Total PDF Notes: ${materials}`);
    await mongoose.disconnect();
}

check();
