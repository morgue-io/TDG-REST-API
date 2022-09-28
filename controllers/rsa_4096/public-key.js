const fs = require('fs');

/* Function to export public key to Android and React clients */
exports.exportPublicKey = (_, res) => {
    res.status(200).json({
        success: true,
        message: 'PUB_KEY [base64]',
        pubkey: Buffer.from(fs.readFileSync('../../config/public_key.pem'), 'utf8').toString('hex')
    });
};