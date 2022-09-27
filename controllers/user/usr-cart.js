const { userModel } = require("../../schemas/user");
require('dotenv').config();

exports.getCartHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
                throw new Error('Fatal: USEROBJ key not found on request');

        res.status(200).json({
            success: true,
            message: 'All good',
            payload: req.USEROBJ.cart
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE? e.message : 'An error was encountered, check your request and try again'
        });
    }
};

exports.postCartHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');
        
        const userObj = await userModel.findOne({ _id: req.USEROBJ._id });
        userObj.cart = req.body;
        await userObj.save();

        res.status(200).json({
            success: true,
            message: 'Updated'
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE? e.message : 'An error was encountered, check your request and try again'
        });
    }
};