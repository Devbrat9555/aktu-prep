const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Subject = require('./models/Subject');

const listSubjects = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const subjects = await Subject.find({ course: 'B.Tech' }).sort({ year: 1, semester: 1, name: 1 });
        console.log('--- Final B.Tech Subjects ---');
        subjects.forEach(s => console.log(`- ${s.name} (Year ${s.year}, Sem ${s.semester})`));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listSubjects();
