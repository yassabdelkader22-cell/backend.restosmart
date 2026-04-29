// models/JobApplication.js
const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    
    appliedAt: { type: Date, default: Date.now },
    respondedAt: Date,
    
    // العلاقات
    jobOffer: { type: mongoose.Schema.Types.ObjectId, ref: 'JobOffer', required: true },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true }
}, { timestamps: true });


module.exports = mongoose.model('JobApplication', jobApplicationSchema);