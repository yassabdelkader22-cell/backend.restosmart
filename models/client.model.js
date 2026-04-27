const mongoose = require('mongoose');
const clientSchema = new mongoose.Schema({
    idclient: Number,
    defaultTableNumber: String,
    // العلاقات
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    commandes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commande' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Produit' }]
    
}, { timestamps: true });
module.exports = mongoose.model('Client', clientSchema);