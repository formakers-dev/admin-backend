const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const config = require('./config');

// TODO: 클로져 제거하고 진행해보기

const getConnection = () => {
    let connection;

    if (!connection || connection.readyState === 0) {
        connection = mongoose.createConnection(config.fomesDbUrl);
        autoIncrement.initialize(connection);
        setRecoverConfig();
    }

    return function() {
        return connection;
    };
};


const setRecoverConfig = () => {
    getConnection().connection.on('disconnected', getConnection);
};

// const init = () => {
//     const connection = getConnection();
//     console.log(connection);
// };

module.exports = { getConnection: getConnection() };
