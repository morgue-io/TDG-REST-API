const jwt = require('jsonwebtoken');
const { billboardModel } = require('../../schemas/billboard');
const { orderModel } = require('../../schemas/order');
const { userModel } = require('../../schemas/user');
require('dotenv').config();

exports.getOrderHistoryHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');

        const orderHistory = await orderModel.find({ customer_id: req.USEROBJ._id }).sort({ createdAt: -1 });
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

exports.calcBill = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');

        const billb = (await billboardModel.find({ _id: process.env.BILLBOARD_OBJ }))[0]
        
        console.log(JSON.stringify(billb, null, 4))
        console.log(billb)

        var bill = 0;
        var serviceable = [
            "blazer",
            "shirt_and_tshirt",
            "pant_and_trousers",
            "saree",
            "ladies_upper",
            "ladies_lower",
            "cloths_and_others"
        ]
        for (var i = 0; i < 7; i++)
            bill += billb.formal_wash[serviceable[i]] * req.body.formal_wash[i].quantity;
        for (var i = 0; i < 7; i++)
            bill += billb.dry_wash[serviceable[i]] * req.body.dry_wash[i].quantity;
        for (var i = 0; i < 7; i++)
            bill += billb.steam_iron[serviceable[i]] * req.body.steam_iron[i].quantity;

        res.status(200).json({
            success: true,
            message: 'Rate calculated in INR',
            payload: `₹ ${bill}`
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e.message : 'An error was encountered, check your request and try again'
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
            customer_id: userObj._id,
            customer_name: userObj.name,
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