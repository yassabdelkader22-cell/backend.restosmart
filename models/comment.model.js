const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: String,
    text: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    avatar: String,
    
    // علاقة مع عامل فقط
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);