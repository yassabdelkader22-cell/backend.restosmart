const mongoose = require('mongoose');

const workHistorySchema = new mongoose.Schema({
    place: String,
    role: String,
    duration: String,
    rating: { type: Number, min: 1, max: 5 },
    review: String,

    // علاقة مع مدير
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager' },
    
    startDate: Date,
    endDate: Date,
    
    // علاقة مع عامل
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true }
}, { timestamps: true });

module.exports = mongoose.model('WorkHistory', workHistorySchema);