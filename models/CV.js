// models/CV.js
const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
    name: String,
    role: String,
    bio: String,
    email: String,
    phone: String,
    location: String,
    experience: String,
    skills: [String],
    languages: [String],
    coverImage: String,
    profileImage: String,
    
    // العلاقات
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('CV', cvSchema);