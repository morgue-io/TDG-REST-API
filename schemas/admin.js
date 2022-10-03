const mongoose = require('mongoose');
require('dotenv').config('../.env');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
});

exports.adminModel = mongoose.model('admin', adminSchema, 'admin-profiles');