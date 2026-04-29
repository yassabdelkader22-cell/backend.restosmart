const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    prix: { type: Number, required: true, min: 0 },
    description: String,
    image: String,
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ordersCount: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    
    categorie: { 
        type: String, 
        enum: ['plat', 'boisson', 'chicha', 'dessert'], 
        required: true 
    },
    sousCategorie: String,
    
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager' },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commande' }]
}, { timestamps: true });

module.exports = mongoose.model('Produit', produitSchema);