const mongoose = require('mongoose');
const config = require('config');
const mongoURI = config.get('mongoURI');
const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        mongoose.set('debug', true);
        console.log('MongoDB connected...');
    } catch (error) {
        console.log(error.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
