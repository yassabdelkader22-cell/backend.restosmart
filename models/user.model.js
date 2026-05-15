// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    phone: String,
    avatar: String,
    coverImage: String,
    profileImage: String,
    location: String,
    bio: String,
    role: { 
        type: String, 
        enum: ['CLIENT', 'WORKER', 'MANAGER', 'OWNER'], 
        default: 'CLIENT' 
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// فهارس للبحث السريع



userSchema.pre('save', async function(next) {
   
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
});

module.exports = mongoose.model('User', userSchema);
