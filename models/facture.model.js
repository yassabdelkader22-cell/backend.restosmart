// models/Facture.js
const mongoose = require('mongoose');

const factureSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    
    // علاقة مع طاولة
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
    
    // علاقة مع مجموعة الطاولات
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Groupe', required: true },
    
    // علاقة مع مطعم
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    
    // علاقة مع الطلبات (أوامر)
    orderIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commande' }],
    
    total: { type: Number, required: true },
    itemsCount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    time: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Facture', factureSchema);