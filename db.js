const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const config = require('./config');

const connect = () => {
    mongoose.connect(config.fomesDbUrl, function(err) {
        if (err) {
            console.error('mongodb connection error', err);
        } else {
            console.log('mongodb connected');
        }
    });
    autoIncrement.initialize(mongoose.connection);
};

const setRecoverConfig = () => {
    mongoose.connection.on('disconnected', connect);
};

const init = () => {
    connect();
    setRecoverConfig();
};

module.exports = {init};