
const mongoose = require('mongoose');
require('dotenv').config();

async function checkCount() {
    try {
        await mongoose.connect('mongodb+srv://fixit:Fixit12345@cluster0.zl7q3od.mongodb.net/gatequest?retryWrites=true&w=majority');
        const StudyMaterial = mongoose.model('StudyMaterial', new mongoose.Schema({}, { strict: false }));
        const count = await StudyMaterial.countDocuments({ type: 'notes' });
        console.log(`Total Notes in DB: ${count}`);
        
        const subjects = await StudyMaterial.distinct('subject');
        console.log(`Total Subjects: ${subjects.length}`);
        console.log(`Subjects: ${subjects.join(', ')}`);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkCount();
