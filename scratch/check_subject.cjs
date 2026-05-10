const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

const Subject = require('../server/models/Subject');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const subjects = await Subject.find({ 
        course: 'B.Tech',
        semester: 1 
    });

    console.log("Subjects in B.Tech Sem 1:");
    subjects.forEach(s => console.log(`- ${s.name} (ID: ${s._id})`));

    process.exit(0);
}

check();
