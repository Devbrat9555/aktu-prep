const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    college: { type: String, default: '' },
    rollNo: { type: String, default: '' },
    branch: { type: String, default: '' },
    year: { type: String, default: '' },
    points: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
