const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
    place: String,
    role: String,
    duration: String,
    rating: { type: Number, min: 1, max: 5, required: true },
    review: String,
    
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }
}, { timestamps: true });

module.exports = mongoose.model('Evaluation', evaluationSchema);