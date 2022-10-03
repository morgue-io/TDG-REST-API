const mongoose = require('mongoose');
require('dotenv').config('../.env');

const sudoSchema = new mongoose.Schema({
    sudo: String
}, {
    versionKey: false,
    timestamps: false
});

exports.sudoModel = mongoose.model('superuser', sudoSchema, 'superuser');