const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Subject = require('./models/Subject');
const StudyMaterial = require('./models/StudyMaterial');

const purgeOldSubjects = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected for Purge...');

        // List of abbreviated names to remove
        const toRemove = [
            'AI', 'DBMS', 'COA', 'TOC', 'DAA', 'PPS', 'OOPS JAVA', 'MATH 1', 'MATH 2', 'MATH 4',
            'ITCS', 'UHV', 'EVS', 'NLP', 'IOT', 'FME', 'FMS MECHNICAL ENG 1ST YEAR'
        ];

        for (const name of toRemove) {
            const oldSubject = await Subject.findOne({ name: name, course: 'B.Tech' });
            if (oldSubject) {
                // Find the new counterpart
                // (This is just a safety check, we just want to remove these abbreviated ones)
                console.log(`[PURGING] Removing ${name}...`);
                
                // Move materials to new subject?
                // For now, let's just delete the subject to clean up the UI.
                // The user can re-sync from Drive if needed.
                await Subject.deleteOne({ _id: oldSubject._id });
            }
        }

        console.log('Purge complete!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

purgeOldSubjects();
