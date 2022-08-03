const mongoose = require('mongoose');
require('dotenv').config('../.env');

const rtokenSchema = new mongoose.Schema({
    rtoken: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    utype: {
        type: String,
        enum: ['customer', 'employee', 'admin'],
        required: true
    },
    expire_at: {
        type: String,
        default: Date.now() + parseInt(process.env.JWT_REFRESH_EXP)
    }
}, {
    versionKey: false,
    timestamps: false
});

exports.rtokenModel = mongoose.model('refresh-token', rtokenSchema, 'refresh-tokens');