const mongoose = require('mongoose');

const ContributionSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true
    },
    studentEmail: {
        type: String,
        required: true
    },
    course: {
        type: String,
        enum: ['B.Tech', 'MBA', 'B.Pharma'],
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['note', 'lecture'],
        required: true
    },
    content: {
        type: String, // Can be a URL to a drive/lecture or a file path
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Contribution', ContributionSchema);
