const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true, unique: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit' },
        name: String,
        quantity: { type: Number, default: 1 },
        prix: Number
    }],
    total: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);