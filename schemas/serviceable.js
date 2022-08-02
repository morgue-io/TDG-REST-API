const mongoose = require('mongoose');

exports.serviceable = new mongoose.Schema({
    item: {
        type: String,
        enum: ['blazer', 'shirt-and-tshirt', 'pant-and-trousers', 'saree', 'ladies-upper', 'ladies-lower', 'cloths-and-others'],
        required: true
    },
    quantity: {
        type: Number,
        min: 0,
        required: true
    }
});