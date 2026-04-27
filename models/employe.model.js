// models/Worker.js
const mongoose = require('mongoose'); // ✅ إزالة Router من السطر الأول

const workerSchema = new mongoose.Schema({
    // العلاقة مع المستخدم الأساسي
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',  // ✅ تصحيح: ref بدلاً من role
        required: true, 
        unique: true 
    },
    role: { type: String, default: 'WORKER' },
    experience: String,
    skills: [String],
    languages: [String],
    status: { type: String, enum: ['WORKING', 'FREE', 'SEEKING'], default: 'FREE' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    workSchedule: String,

    // العلاقات
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager' },
    groupe: { type: mongoose.Schema.Types.ObjectId, ref: 'Groupe' },
    commandes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commande' }],
    tables: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Table' }],
    evaluations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evaluation' }],
    workHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkHistory' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    cv: { type: mongoose.Schema.Types.ObjectId, ref: 'CV' }
}, { timestamps: true });

module.exports = mongoose.model('Worker', workerSchema);