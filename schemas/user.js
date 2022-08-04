const mongoose = require('mongoose');
const serviceable = require('./serviceable');
require('dotenv').config('../.env');

const userSchema = new mongoose.Schema({
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
        required: true,
        min: 10,
        max: 10
    },
    address: {
        type: String,
        default: ''
    },
    cart: {
        dry_wash: [{ type: serviceable }],
        formal_wash: [{ type: serviceable }],
        steam_iron: [{ type: serviceable }]
    }
}, {
    versionKey: false,
    timestamps: true
});

exports.userModel = mongoose.model('user', userSchema, 'user-profiles');