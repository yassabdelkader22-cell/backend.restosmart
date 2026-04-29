
// models/Restaurant.js
const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: String,
    phone: String,
    email: String,
    image: String,
    logo: String,
    rating: { type: Number, default: 0, min: 0, max: 5 },
    employeesCount: { type: Number, default: 0 },
    openingHours: String,
    description: String,
    location: String,
    
    // العلاقات
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager' },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Produit' }],
    tables: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Table' }],
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Groupe' }],
    workers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Worker' }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Facture' }],
    clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }]
    
}, { timestamps: true });
module.exports = mongoose.model('Restaurant', restaurantSchema);