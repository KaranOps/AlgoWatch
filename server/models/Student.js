const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    codeforcesHandle: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    currentRating: {
        type: Number,
        default: 0
    },
    maxRating: {
        type: Number,
        default: 0
    },
    cfUserInfo: { type: Object },
    cfRatingHistory: { type: Array, default: [] },
    cfSubmissions: { type: Array, default: [] },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    reminderCount: { type: Number, default: 0 },
    autoEmailEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.models.Student || mongoose.model('Student', StudentSchema);