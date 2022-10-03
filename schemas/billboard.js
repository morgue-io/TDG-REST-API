const mongoose = require('mongoose');
require('dotenv').config('../.env');

const billboardSchema = new mongoose.Schema({
    dry_wash: {
        blazer: Number, 
        shirt_and_tshirt: Number, 
        pant_and_trousers: Number, 
        saree: Number, 
        ladies_upper: Number, 
        ladies_lower: Number, 
        cloths_and_others: Number
    },
    formal_wash: {
        blazer: Number, 
        shirt_and_tshirt: Number, 
        pant_and_trousers: Number, 
        saree: Number, 
        ladies_upper: Number, 
        ladies_lower: Number, 
        cloths_and_others: Number
    },
    steam_iron: {
        blazer: Number, 
        shirt_and_tshirt: Number, 
        pant_and_trousers: Number, 
        saree: Number, 
        ladies_upper: Number, 
        ladies_lower: Number, 
        cloths_and_others: Number
    }
}, {
    versionKey: false,
    timestamps: false
});

exports.billboardModel = mongoose.model('billboard', billboardSchema, 'billboard');