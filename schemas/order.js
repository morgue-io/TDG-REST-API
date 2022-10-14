const mongoose = require('mongoose');
const { getLocalTime } = require('../utils/local-time');
const serviceable = require('./serviceable');
const crypto = require('crypto')
require('dotenv').config('../.env');

const orderSchema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    customer_name: {
        type: String,
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
                default: getLocalTime
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
            },
            verif_code: {
                type: String,
                default: () => crypto.randomBytes(4).toString('hex').toUpperCase()
            },
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
            assignee_id: {
                /* this field will contain a Mongo DBRef to a doc in employee Model 
                to announce voluntary task assignment state by employee client */
                type: mongoose.Schema.Types.ObjectId,
                default: null
            },
            assignee_name: {
                type: String,
                default: null
            },
            verif_code: {
                type: String,
                default: 'VOID_STRING'
            }
        }
    }
}, {
    versionKey: false,
    timestamps: true
});

exports.orderModel = mongoose.model('order', orderSchema, 'gscope-orders');