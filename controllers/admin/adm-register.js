const { adminModel } = require("../../schemas/admin");
const { rtokenModel } = require("../../schemas/rtoken");
const { decrypt } = require("../../utils/rsa_4096");
const { sha256_hex } = require("../../utils/sha256");
require('dotenv').config();

exports.registrationHandler = async (req, res) => {
    try {
        if (!!(await adminModel.findOne({ email: req.body.email }))) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        const newAdminObj = new adminModel(req.body);
        const decryptedPwd = decrypt(newAdminObj.password);
        const pwdHash = sha256_hex(decryptedPwd);
        newAdminObj.password = pwdHash;
        await newAdminObj.save();

        res.status(200).json({
            success: true,
            message: 'Registered'
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE? e.message : 'An error was encountered, check your request and try again'
        });
    }
};

exports.deregistrationHandler = async (req, res) => {
    try {
        if (!req.ADMINOBJ)
            throw new Error('Fatal: ADMINOBJ key not found on request');
            
        const decryptedPwd = decrypt(req.body.password);
        const pwdHash = sha256_hex(decryptedPwd);
        const adminObj = req.ADMINOBJ;
        if (pwdHash !== adminObj.password) {
            res.status(401).json({
                success: false,
                message: 'Admin credentials invalid'
            });
        } else {
            await userModel.deleteMany({ _id: adminObj._id });
            await rtokenModel.deleteMany({ 
                email: req.ADMINOBJ.email, 
                utype: 'admin'
            });
            res.status(200).json({
                success: true,
                message: 'Deregistered'
            });
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE? e.message : 'An error was encountered, check your request and try again'
        });
    }
};