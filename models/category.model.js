// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: String,
    color: String,
    iconImage: String,
    displayOrder: Number,
    
    // العلاقات
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Produit' }]
}, { timestamps: true });


module.exports = mongoose.model('Category', categorySchema);