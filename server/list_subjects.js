const mongoose = require('mongoose');
const Subject = require('./models/Subject');
require('dotenv').config();

const listSubjects = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const subjects = await Subject.find();
        console.log("All Subjects:", JSON.stringify(subjects, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listSubjects();
