const mongoose = require('mongoose');
const StudyMaterial = require('./models/StudyMaterial');
const Subject = require('./models/Subject');
require('dotenv').config();

const fixBatches = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Find or create the target subjects
        const subjects = ['Delta Batch 6.0', 'Dot Batch', 'Rohit Negi Batch'];
        const subjectMap = {};
        
        for (const name of subjects) {
            let sub = await Subject.findOne({ name, course: 'Coding' });
            if (!sub) {
                sub = new Subject({ name, course: 'Coding', year: 0, semester: 0 });
                await sub.save();
            }
            subjectMap[name] = sub._id;
        }

        // MOVE all currently "Web Development" or "DSA" videos to "Dot Batch" for testing
        const codingSubjects = await Subject.find({ course: 'Coding' });
        const codingIds = codingSubjects.map(s => s._id);
        
        const result = await StudyMaterial.updateMany(
            { subjectId: { $in: codingIds } },
            { subjectId: subjectMap['Dot Batch'] }
        );
        
        console.log(`Updated ${result.modifiedCount} videos to Dot Batch folder.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixBatches();
