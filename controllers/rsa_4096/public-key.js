const fs = require('fs');

/* Function to export public key to Android and React clients */
exports.exportPublicKey = async (_, res) => {
    res.status(200).json({
        success: true,
        message: 'PUB_KEY [base64]',
        pubkey: fs.readFileSync('./config/public_key.pem').toString()
    });
};