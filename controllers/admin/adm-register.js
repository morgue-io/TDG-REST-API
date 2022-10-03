const { adminModel } = require("../../schemas/admin");
const { rtokenModel } = require("../../schemas/rtoken");
const { sudoModel } = require("../../schemas/superuser");
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

        if (!(await sudoModel.findOne({ sudo: decrypt(req.body.sudo) }))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid superuser token'
            });
        } 

        const decryptedPwd = decrypt(req.body.password);
        const pwdHash = sha256_hex(decryptedPwd);
        const newAdminObj = new adminModel({
            name: req.body.name,
            email: req.body.email,
            password: pwdHash,
            phone: req.body.phone
        });
        await newAdminObj.save();

        res.status(200).json({
            success: true,
            message: 'Registered'
        });
    } catch (e) {
        console.error(e);
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

        if (!(await sudoModel.findOne({ sudo: decrypt(req.body.sudo) }))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid superuser token'
            });
        } else {
            await adminModel.deleteMany({ _id: req.query.id });
            await rtokenModel.deleteMany({ 
                email: req.query.email,
                utype: 'admin'
            });
            res.status(200).json({
                success: true,
                message: 'Deregistered'
            });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE? e.message : 'An error was encountered, check your request and try again'
        });
    }
};

exports.getAdminsHandler = async (_, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'GET Achnowledged',
            payload: await adminModel.find({}).select('_id name email phone createdAt updatedAt')
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE? e.message : 'An error was encountered, check your request and try again'
        });
    }
};