const mongoose = require('mongoose');

const groupeSchema = new mongoose.Schema({
    nomgroupe: { type: String, required: true },
    description: String,
    startNumber: { type: Number, required: true },
    endNumber: { type: Number, required: true },
    
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    employe: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
    tables: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Table' }],
    factures: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Facture' 
    }],
    
    totalTablesofgroupe: { type: Number, default: 0 },
    tablesOccupeesofgroupe: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Groupe', groupeSchema);