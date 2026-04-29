const mongoose = require('mongoose');
const clientSchema = new mongoose.Schema({
    idclient: Number,
   
    // العلاقات
    commandes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commande' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Produit' }],
    tableNumber: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Table' }]
}, { timestamps: true });
module.exports = mongoose.model('Client', clientSchema);