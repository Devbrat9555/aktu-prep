require('dotenv').config();
const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const StudyMaterial = require('../models/StudyMaterial');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const subs = await Subject.find({ course: 'Coding' });
    console.log('Coding subjects:', subs.map(s => s.name));
    
    const ids = subs.map(s => s._id);
    const mats = await StudyMaterial.find({ subjectId: { $in: ids } });
    console.log('Total materials:', mats.length);
    
    // Show breakdown
    const byType = {};
    mats.forEach(m => { byType[m.type] = (byType[m.type] || 0) + 1; });
    console.log('By type:', byType);
    
    if (mats.length > 0) {
        console.log('Sample:', mats[0].title, '->', mats[0].url);
    }
    
    process.exit(0);
}).catch(err => { console.error(err.message); process.exit(1); });
