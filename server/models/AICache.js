const mongoose = require('mongoose');

const AICacheSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        unique: true, // Exact matches will be cached
        lowercase: true,
        trim: true
    },
    answer: {
        type: String,
        required: true
    },
    askedCount: {
        type: Number,
        default: 1
    },
    lastAskedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index for faster searching
AICacheSchema.index({ question: 'text' });

module.exports = mongoose.model('AICache', AICacheSchema);
