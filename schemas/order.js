const mongoose = require('mongoose');
const { getLocalTime } = require('../utils/local-time');
const serviceable = require('./serviceable');
require('dotenv').config('../.env');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    todo: {
        dry_wash: [{ type: serviceable, default: [] }],
        formal_wash: [{ type: serviceable, default: [] }],
        steam_iron: [{ type: serviceable, default: [] }]
    },
    status: {
        accepted: {
            state: {
                type: Boolean,
                default: true
            },
            time: {
                type: String,
                default: getLocalTime()
            }
        },
        picked_up: {
            state: {
                type: Boolean,
                default: false
            },
            time: {
                type: String,
                default: null
            },
            assignee: {
                /* this field will contain a Mongo DBRef to a doc in employee Model 
                to announce voluntary task assignment state by employee client */
                type: mongoose.Schema.Types.ObjectId,
                default: null
            }
        },
        processing: {
            state: {
                type: Boolean,
                default: false
            },
            time: {
                type: String,
                default: null
            }
        },
        delivered: {
            state: {
                type: Boolean,
                default: false
            },
            time: {
                type: String,
                default: null
            },
            assignee: {
                /* this field will contain a Mongo DBRef to a doc in employee Model 
                to announce voluntary task assignment state by employee client */
                type: mongoose.Schema.Types.ObjectId,
                default: null
            }
        }
    }
}, {
    versionKey: false,
    timestamps: true
});

exports.orderModel = mongoose.model('order', orderSchema, 'gscope-orders');