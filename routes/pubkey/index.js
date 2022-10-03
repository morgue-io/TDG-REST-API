const express = require('express');
const router = express.Router();

router.get('/public', require('../../controllers/rsa_4096/public-key').exportPublicKey);

module.exports = router;