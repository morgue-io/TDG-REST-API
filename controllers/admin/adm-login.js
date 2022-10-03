const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { decrypt } = require('../../utils/rsa_4096');
const { rtokenModel } = require('../../schemas/rtoken');
const { sha256_hex } = require('../../utils/sha256');
const { adminModel } = require('../../schemas/admin');
require('dotenv').config();

/* Function to verify user login password and for generating access tokens */
exports.adminLoginHandler = async (req, res, next) => {
    try {
        const adminObj = await adminModel.findOne({ email: req.body.email });

        if (adminObj == null) {
            res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        } else {
            if (sha256_hex(decrypt(req.body.password)) !== adminObj.password) {
                res.status(401).json({
                    success: false,
                    message: 'Admin credentials invalid'
                });
            } else {
                const token = jwt.sign({
                        _id: adminObj._id,
                        email: adminObj.email
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: parseInt(process.env.JWT_EXP) }
                );
                const token_refresh = jwt.sign({
                        _id: adminObj._id,
                        email: adminObj.email,
                        salt: crypto.randomBytes(32).toString('hex')
                    },
                    process.env.JWT_SECRET
                );

                await rtokenModel.findOneAndUpdate(
                    { email: req.body.email },
                    {
                        rtoken: token_refresh, 
                        email: req.body.email,
                        utype: 'admin'
                    },
                    { upsert: true }
                );

                return res.status(200).json({
                    success: true,
                    message: "Authorised",
                    jwt: token,
                    jwt_refresh: token_refresh
                });
            }
            return next();
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE? e.message : 'An error was encountered, check your request and try again'
        });
    }
};

/* Function to obliterate refresh jwts of users logging out */
exports.adminLogoutHandler = async (req, res) => {
    try {
        if (!req.ADMINOBJ)
            throw new Error('Fatal: ADMINOBJ key not found on request');

        jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET, async (err, adminObj) => {
            if (err)
                res.status(400).json({
                    success: false,
                    message: process.env.DEBUG_MODE? err.message : 'An error was encountered, check your request and try again'
                });
            
            await rtokenModel.deleteMany({ 
                email: adminObj.email, 
                utype: 'admin'
            });

            res.status(200).json({
                success: true,
                message: 'Logged out'
            });
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE? e.message : 'An error was encountered, check your request and try again'
        });
    }
};