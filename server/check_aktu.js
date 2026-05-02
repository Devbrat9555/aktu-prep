const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Subject = require('./models/Subject');
const StudyMaterial = require('./models/StudyMaterial');

async function checkAKTU() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const counts = await Subject.aggregate([
            { $match: { course: 'B.Tech' } },
            { $group: { _id: '$semester', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        console.log('AKTU Subjects per Semester:', counts);

        // 1. Remove Papers/PYQs
        const delRes = await StudyMaterial.deleteMany({ 
            title: { $regex: /paper|pyq|previous|semester exam|question paper/i } 
        });
        console.log(`Removed ${delRes.deletedCount} paper/PYQ records.`);

        // 2. Auto-assign units from titles
        const materials = await StudyMaterial.find({ unit: { $exists: false } });
        let updatedUnits = 0;
        for (const mat of materials) {
            const unitMatch = mat.title.match(/unit\s*(\d+)/i) || mat.title.match(/u\s*(\d+)/i) || mat.title.match(/part\s*(\d+)/i);
            if (unitMatch) {
                const unitNum = parseInt(unitMatch[1]);
                if (unitNum >= 1 && unitNum <= 5) {
                    mat.unit = unitNum;
                    await mat.save();
                    updatedUnits++;
                }
            }
        }
        console.log(`Auto-assigned units to ${updatedUnits} materials.`);

        // 3. Find empty subjects
        const subjects = await Subject.find({ course: 'B.Tech' });
        const emptySubjects = [];
        for (const sub of subjects) {
            const count = await StudyMaterial.countDocuments({ subjectId: sub._id });
            if (count === 0) emptySubjects.push(`${sub.name} (Sem ${sub.semester})`);
        }
        console.log(`Empty subjects found: ${emptySubjects.length}`);
        if (emptySubjects.length > 0) {
            console.log('Empty list:', emptySubjects.slice(0, 10).join(', '));
        }

        const mat = await StudyMaterial.findOne({ title: /DnC Level-1/ });
        if (mat) {
            const sub = await Subject.findById(mat.subjectId);
            console.log(`FOUND: ${mat.title} is in Subject: ${sub.name} (Course: ${sub.course})`);
        } else {
            console.log('No DnC Level-1 found.');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkAKTU();
