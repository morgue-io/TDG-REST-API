const mongoose = require('mongoose');
require('dotenv').config('../.env');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
});

exports.adminModel = mongoose.model('admin', adminSchema, 'admin-profiles');