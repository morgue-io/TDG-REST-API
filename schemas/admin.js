const mongoose = require('mongoose');
require('dotenv').config('../.env');

const adminSchema = new mongoose.Schema({
    username: {
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

module.exports = mongoose.model('user', userSchema, 'user-profiles');