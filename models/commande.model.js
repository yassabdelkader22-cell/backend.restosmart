// models/Commande.js
const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
    
    orderNumber: { type: Number, required: true },
    
    // علاقة مع منتج (جلب البيانات من Produit)
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit', required: true },
    
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
    
    // علاقة مع طاولة
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
    
    // علاقة مع عامل
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    
    // علاقة مع عميل
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    
    status: { type: String, enum: ['en attente', 'livree', 'annulé'], default: 'en attente' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Commande', commandeSchema);