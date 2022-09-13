const crypto = require('crypto');

exports.sha256_hex = (input) => {
    return crypto.createHash('sha256').update(input).digest('hex');
};

exports.sha256_base64 = (input) => {
    return crypto.createHash('sha256').update(input).digest('base64');
};