const jwt = require('jsonwebtoken');
const { rtokenModel } = require('../../schemas/rtoken');
const { adminModel } = require('../../schemas/admin');
require('dotenv').config();

/* Function to authorise user with permission to access protected user data */
exports.authorisationHandler = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET, async (err, adminObj) => {
                if (err) {
                    res.status(400).json({
                        success: false,
                        message: process.env.DEBUG_MODE? err.message : 'An error was encountered, check your request and try again'
                    });
                } else if (await rtokenModel.findOne({ email: adminObj.email, utype: 'admin' }) != null) {
                    req.IS_AUTH = true;
                    req.ADMINOBJ = await adminModel.findOne({ _id: adminObj._id });
                    return next();
                } else {
                    return res.status(403).json({
                        success: false,
                        message: 'Re-login to continue'
                    });
                }
            });
        } else {
            res.status(403).json({
                success: false,
                message: 'Token missing in payload'
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

/* Function to create new authorisation token from refresh token after the latter's expiry */
exports.refreshAuthorisationHandler = async (req, res) => {
    try {
        if (req.headers.authorization) {
            const rtokenObj = await rtokenModel.findOne({ rtoken: req.headers.authorization.split(' ')[1] });
            
            if (rtokenObj == null)
                return res.status(400).json({
                    success: false,
                    message: 'Invalid token'
                });

            const adminObj = await adminModel.findOne({ email: rtokenObj.email });
            const token = jwt.sign({
                    _id: adminObj._id,
                    email: adminObj.email
                }, 
                process.env.JWT_SECRET,
                { expiresIn: parseInt(process.env.JWT_EXP) }
            );

            return res.status(200).json({
                success: true,
                message: 'Token generated',
                jwt: token,
                jwt_refresh: rtokenObj.rtoken
            });
        } else {
            res.status(403).json({
                success: false,
                message: 'Token payload missing'
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