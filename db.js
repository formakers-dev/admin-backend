const mongoose = require('mongoose');
const config = require('./config');

const constants = {};
Object.defineProperty(constants, 'FOMES', {
    value: 'fomes',
    writable: false,
    configurable: false
});
Object.defineProperty(constants, 'ADMIN', {
    value: 'admin',
    writable: false,
    configurable: false
});


const DBMap = {
    admin: {
        url: config.adminDbUrl,
        connection: null
    },
    fomes: {
        url: config.fomesDbUrl,
        connection: null
    }
};

const getConnection = (dbName) => {
    const db = DBMap[dbName];

    if (!db) {
        throw new Error(`DB['${dbName}'] doesn't exist.`);
    }

    if (!db.connection || db.connection.readyState === 0) {
        db.connection = mongoose.createConnection(db.url);

        setRecoverConfig(dbName);
    }

    return db.connection;
};

const setRecoverConfig = (dbName) => {
    const retryConnect = () => {
        getConnection(dbName);
    };

    DBMap[dbName].connection.on('disconnected', retryConnect);
};

module.exports = { getConnection, constants };
