const { adminModel } = require('../../schemas/admin');
const { rtokenModel } = require('../../schemas/rtoken');
const { decrypt } = require("../../utils/rsa_4096");
const { sha256_hex } = require("../../utils/sha256");
require('dotenv').config();

exports.postUserCredentialHandler = async (req, res) => {
    try {
        if (!req.ADMINOBJ)
            throw new Error('Fatal: ADMINOBJ key not found on request');

        const adminObj = await adminModel.findOne({ username: req.ADMINOBJ.email });

        if (sha256_hex(decrypt(req.body.password)) !== adminObj.password) {
            return res.status(401).json({
                success: false,
                message: 'Admin credentials invalid'
            });
        } else {
            adminObj.password = sha256_hex(decrypt(req.body.new_password));
            
            await adminObj.save();

            return res.status(200).json({
                success: true,
                message: "Credentials updated"
            });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e.message : 'An error was encountered, check your request and try again'
        });
    }
};