const { encrypt, decrypt } = require("./rsa_4096");

exports.interpret = () => {
    console.log(encrypt('69'));
};