const jwt = require('jsonwebtoken');
const { userModel } = require('../../schemas/user');
const { rtokenModel } = require('../../schemas/rtoken');
require('dotenv').config();

/* Function to authorise user with permission to access protected user data */
exports.authorisationHandler = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET, async (err, userObj) => {
                if (err) {
                    res.status(400).json({
                        success: false,
                        message: process.env.DEBUG_MODE? err.message : 'An error was encountered, check your request and try again'
                    });
                } else if (await rtokenModel.findOne({ email: userObj.email, utype: 'customer' }) != null) {
                    req.IS_AUTH = true;
                    req.USEROBJ = await userModel.findOne({ _id: userObj._id });
                    return next();
                } else {
                    return res.status(403).json({
                        success: false,
                        message: 'Login to continue'
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

            const userObj = await userModel.findOne({ email: rtokenObj.email });

            if (userObj == null)
                return res.status(400).json({
                    success: false,
                    message: 'Invalid token'
                });

            const token = jwt.sign({
                    _id: userObj._id,
                    email: userObj.email
                },
                process.env.JWT_SECRET,
                { expiresIn: parseInt(process.env.JWT_EXP) }
            );

            return res.status(200).json({
                success: true,
                message: 'Token generated',
                jwt: token
            });
        } else {
            res.status(403).json({
                success: false,
                message: 'Token payload missing'
            });
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE? e.message : 'An error was encountered, check your request and try again'
        });
    }
};