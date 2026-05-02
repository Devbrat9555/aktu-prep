const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Subject = require('./models/Subject');
const StudyMaterial = require('./models/StudyMaterial');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const sub = await Subject.findOne({name: 'DSA Supreme Batch', course: 'Coding'});
        if (sub) {
            const mats = await StudyMaterial.find({subjectId: sub._id}).sort({url: 1}).limit(50);
            mats.forEach(m => console.log(`${m.title} | ${m.url}`));
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
