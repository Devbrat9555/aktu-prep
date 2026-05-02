const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Subject = require('./models/Subject');
const StudyMaterial = require('./models/StudyMaterial');

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);
    const ai = await Subject.findOne({ name: /AI/i });
    if (!ai) {
        console.log("Subject AI not found");
        return;
    }
    const notes = await StudyMaterial.find({ subjectId: ai._id });
    console.log(`Found ${notes.length} notes for AI:`);
    notes.forEach(n => {
        console.log(`- ${n.title} (Unit: ${n.unit}, Type: ${n.type})`);
    });
    await mongoose.disconnect();
}

check();
