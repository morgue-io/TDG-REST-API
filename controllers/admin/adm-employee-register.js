const { adminModel } = require("../../schemas/admin");
const { employeeModel } = require("../../schemas/employee");
const { rtokenModel } = require("../../schemas/rtoken");
const { userModel } = require("../../schemas/user");
const { decrypt } = require("../../utils/rsa_4096");
const { sha256_hex } = require("../../utils/sha256");
require('dotenv').config();

exports.registrationHandler = async (req, res) => {
    try {
        if (!!(await employeeModel.findOne({ email: req.body.email })))
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });

        if ((await adminModel.findOne({ _id: req.ADMINOBJ._id })).password !==
                sha256_hex(decrypt(req.body.password))) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: invalid credentials'
            });
        } 

        const newEmployeeObj = new employeeModel(req.body.new_employee);
        const decryptedPwd = decrypt(newEmployeeObj.password);
        const pwdHash = sha256_hex(decryptedPwd);
        newEmployeeObj.password = pwdHash;
        await newEmployeeObj.save();

        res.status(200).json({
            success: true,
            message: 'Employee registered'
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
            throw new Error('Fatal: USEROBJ key not found on request');

        if ((await adminModel.findOne({ _id: req.ADMINOBJ._id })).password !==
                sha256_hex(decrypt(req.body.password))) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: invalid credentials'
            });
        }

        await userModel.deleteMany({ _id: userObj._id });
        await rtokenModel.deleteMany({ 
            email: req.USEROBJ.email, 
            utype: 'employee'
        });
        res.status(200).json({
            success: true,
            message: 'Employee deregistered'
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE? e.message : 'An error was encountered, check your request and try again'
        });
    }
};