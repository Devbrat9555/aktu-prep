const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['video', 'notes'], required: true },
    url: { type: String, required: true }, // YouTube link or file path
    unit: { type: Number }, // Unit number 1-5
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
