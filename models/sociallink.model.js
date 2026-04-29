// models/SocialLink.js
const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema({
    platform: { 
        type: String, 
        enum: ['FACEBOOK', 'INSTAGRAM', 'TWITTER', 'LINKEDIN', 'TIKTOK'], 
        required: true 
    },
    url: { type: String, required: true },
    
    // العلاقات
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
module.exports = mongoose.model('SocialLink', socialLinkSchema);