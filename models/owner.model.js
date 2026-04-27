// models/Owner.js
const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    restaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
    managers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Manager' }] // ✅ المديرين الذين عينهم
}, { timestamps: true });

ownerSchema.index({ user: 1 });

module.exports = mongoose.model('Owner', ownerSchema);