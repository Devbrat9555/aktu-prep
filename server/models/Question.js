const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    question: { type: String, required: true },
    solution: { type: String, required: true },
    fileUrl: { type: String },
    year: { type: Number, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
