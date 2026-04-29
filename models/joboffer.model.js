// models/JobOffer.js
const mongoose = require('mongoose');

const jobOfferSchema = new mongoose.Schema({
    // العلاقة مع المطعم
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    
    // العلاقة مع المدير
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager', required: true }
    
}, { timestamps: true });

module.exports = mongoose.model('JobOffer', jobOfferSchema);