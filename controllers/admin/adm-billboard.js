const { billboardModel } = require("../../schemas/billboard");
require('dotenv').config();

exports.getBillboardHandler = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'GET Acknowledged',
            payload: [await billboardModel.findById(process.env.BILLBOARD_OBJ)]
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE? e.message : 'An error was encountered, check your request and try again'
        });
    }
};

exports.postBillboardHandler = async (req, res) => {
    try {
        console.log(await billboardModel.findByIdAndUpdate(process.env.BILLBOARD_OBJ, {
            formal_wash: req.body.formal_wash,
            dry_wash: req.body.dry_wash,
            steam_iron: req.body.steam_iron
        }));

        res.status(200).json({
            success: true,
            message: 'Updated billboard'
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE? e.message : 'An error was encountered, check your request and try again'
        });
    }
};