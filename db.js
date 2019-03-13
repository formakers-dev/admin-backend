const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const config = require('./config');

const getConnection = () => {
    console.log('getConnection');
    let connection;

    if (!connection) {
        connection = mongoose.createConnection(config.fomesDbUrl, function (err) {
            if (err) {
                console.error('mongodb connection error', err);
            } else {
                console.log('mongodb connected');
            }
        });
    }

    return function() {
        console.log('getConnection closure');
        return connection;
    };
};

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
    console.log(getConnection()());
};

module.exports = {init};
