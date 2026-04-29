const mongoose = require('mongoose');
const crypto = require('crypto');

const tableSchema = new mongoose.Schema({
    numero: { type: Number, required: true },
    qrCode: { type: String, unique: true },
    qrCodeImage: String,
    batchId: String,
    etat: { 
        type: String, 
        enum: ['libre', 'occupée', 'reserved'], 
        default: 'libre' 
    },
    
    groupe: { type: mongoose.Schema.Types.ObjectId, ref: 'Groupe', required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager', required: true },
    employe: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
    clientActuel: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }],
    commandes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commande' }],
    factures: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Facture' 
    }],
    
    lastOccupied: Date,
    lastFreed: Date
}, { timestamps: true });

tableSchema.pre('save', function(next) {
    if (this.isNew && !this.qrCode) {
        const uniqueString = crypto.randomBytes(8).toString('hex');
        this.qrCode = `TABLE-${this.numero}-${uniqueString}`;
    }
    next();
});

module.exports = mongoose.model('Table', tableSchema);