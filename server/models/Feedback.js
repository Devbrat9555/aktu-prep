const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userId: {
        type: String, // Clerk User ID
        required: true
    },
    userName: {
        type: String, // Full Name from Clerk
        required: true
    },
    userEmail: {
        type: String, // Email from Clerk
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['request', 'vent'],
        required: true
    },
    isAnonymous: {
        type: Boolean,
        default: true
    },
    likes: [{
        type: String, // Array of User IDs who liked
    }],
    tags: [{
        type: String, // #Faculty, #Exams, etc.
    }],
    targetCollege: {
        type: String, // e.g. Prasad Institute of Technology
        default: null
    },
    targetTeacher: {
        type: String, // Targeted faculty name
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
