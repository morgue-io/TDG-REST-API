const mongoose = require('mongoose');

module.exports = {
    item: {
        type: String,
        enum: ['blazer', 'shirt_and_tshirt', 'pant_and_trousers', 'saree', 'ladies_upper', 'ladies_lower', 'cloths_and_others']
    },
    quantity: {
        type: Number,
        min: 0
    },
    _id: false
};