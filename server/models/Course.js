const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Course', courseSchema);
