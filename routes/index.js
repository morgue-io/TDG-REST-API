const express = require('express');
const router = express.Router();

// routes for the customer applet
router.use('/usr', require('./usr/index'));

// routes for the employee applet
// router.use('/emp', require('./emp/index.js'));

// routes for the admin dashboard
// router.use('/adm', require('./adm/index.js'));

module.exports = router;