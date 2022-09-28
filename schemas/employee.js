const mongoose = require('mongoose');
require('dotenv').config('../.env');

const employeeSchema = new mongoose.Schema({
    meta: {
        is_activated: {
            type: Boolean,
            required: true,
            default: true
        }
    },
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
    attendance: [{
        type: String
    }]
}, {
    versionKey: false,
    timestamps: true
});

exports.employeeModel = mongoose.model('employee', employeeSchema, 'employee-profiles');