const mongoose = require('mongoose');
require('dotenv').config('../.env');

module.exports.connectdb = () => {
    console.log('Connecting to TDG cluster...');
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log('🗸 Connected to Mongo cluster \n');
    } catch (e) {
        console.log('✗ Connection to Mongo cluster failed: Exiting... ' + e + '\n');
        process.exit(1);
    }
};