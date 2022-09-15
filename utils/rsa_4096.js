const crypto = require('crypto');
const fs = require('fs');
require('dotenv').config();

exports.encrypt = (toEncrypt) => {
    const publicKey = fs.readFileSync(process.cwd() + '/' + process.env.PUB_KEY, 'utf8');
    const buffer = Buffer.from(toEncrypt, 'utf8');
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString('hex');
};

exports.decrypt = (toDecrypt) => {
    const privateKey = fs.readFileSync(process.cwd() + '/' + process.env.PVT_KEY, 'utf8');
    const buffer = Buffer.from(toDecrypt, 'hex');
    const decrypted = crypto.privateDecrypt({
        key: privateKey,
        passphrase: process.env.PVT_KEY_PPH,
    }, buffer);
    return decrypted.toString('utf8');
};