const jwt = require('jsonwebtoken');
const { orderModel } = require('../../schemas/order');
const { userModel } = require('../../schemas/user');
require('dotenv').config();

exports.getOrderHistoryHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');

        const orderHistory = await orderModel.find({ customer: req.USEROBJ._id });
        res.status(200).json({
            success: true,
            message: 'All good',
            payload: orderHistory
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e : 'An error was encountered, check your request and try again'
        });
    }
};

exports.postNewOrderHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');

        const userObj = await userModel.findOne({ _id: req.USEROBJ._id });
        if (userObj.cart.dry_wash.length === 0) 
            if (userObj.cart.formal_wash.length === 0) 
                if (userObj.cart.steam_iron.length === 0)
                    throw new Error('Invalid request: Cart is empty');

        const newOrder = new orderModel({
            customer: userObj._id,
            address: req.body.address,
            todo: userObj.cart
        });
        await newOrder.save();
        await userModel.findOneAndUpdate({ _id: req.USEROBJ._id }, {
            cart: {
                dry_wash: [],
                formal_wash: [],
                steam_iron: []
            }
        });

        res.status(200).json({
            success: true,
            message: 'Order placed'
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e.message : 'An error was encountered, check your request and try again'
        });
    }
};