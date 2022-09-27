const mongoose = require('mongoose');

module.exports = {
    item: {
        type: String,
        enum: ['blazer', 'shirt-and-tshirt', 'pant-and-trousers', 'saree', 'ladies-upper', 'ladies-lower', 'cloths-and-others']
    },
    quantity: {
        type: Number,
        min: 0
    },
    _id: false
};