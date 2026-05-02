const mongoose = require('mongoose');
const StudyMaterial = require('./models/StudyMaterial');
const Subject = require('./models/Subject');
require('dotenv').config();

const checkDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const materials = await StudyMaterial.find().populate('subjectId');
        console.log(`Total Materials: ${materials.length}`);
        
        const counts = {};
        materials.forEach(m => {
            const name = m.subjectId.name;
            counts[name] = (counts[name] || 0) + 1;
        });
        
        console.log("Materials by Category:", JSON.stringify(counts, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDb();
