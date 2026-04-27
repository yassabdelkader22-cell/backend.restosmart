// models/Manager.js
const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    role: { type: String, default: 'MANAGER' },
    experience: String,
    skills: [String],
    languages: [String],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    workTime: String,
    
    // العلاقات
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true }, // ✅ المالك الذي عينه
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    groupes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Groupe' }],
    employes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Worker' }],
    tables: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Table' }],
    factures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Facture' }],
    produits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Produit' }],
    evaluations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evaluation' }],
    jobOffers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobOffer' }]
}, { timestamps: true });
    

module.exports = mongoose.model('Manager', managerSchema);