const mongoose = require('mongoose');
const config = require('./config');

const TAG = '[DB]';
const connectionMap = {};

(function init() {
    const gracefulExit = cause => {
        const connectionClosePromises = Object.keys(connectionMap)
            .map(key => connectionMap[key].close()
                .catch(err => `Error occured on closing ${key}:\n${err}`));

        Promise.all(connectionClosePromises)
            .then(results => {
                results.forEach(result => {
                    if (result) {
                        console.error(result)
                    }
                });
                console.log(TAG, `Connections are disconnected due to exit process by ${cause}`);
                process.exit();
            })
            .catch(err => {
                console.error(TAG, `Error occured on disconnecting due to exit process by ${cause}:\n`, err);
                process.exit();
            });
    };

    ['exit', 'SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
        process.on(signal, gracefulExit);
    });

    process.on('uncaughtException', err => {
        console.error('Uncaught Exception:\n', err);
        gracefulExit('uncaught exception');
    });
})();

const add = (connectionName, dbUrl) => {
    let connectionInfo = {
        name: connectionName,
        url: dbUrl,
        connection: null
    };

    Object.defineProperty(connectionMap, connectionName, {
        configurable: true,
        enumerable: true,
        get: () => {
            return getConnection(connectionInfo);
        },
        set: (x) => {}
    });
};

const getConnection = (connectionInfo) => {
    if (!connectionInfo.connection || connectionInfo.connection.readyState === 0) {
        connectionInfo.connection = mongoose.createConnection();

        connectionInfo.connection.on('connected', () => {
            console.log(TAG, `${connectionInfo.name} is connected`);
        });
        connectionInfo.connection.on('error', err => {
            console.error(TAG, `${connectionInfo.name} occurred error:\n`, err);
        });
        connectionInfo.connection.on('disconnected', () => {
            console.log(TAG, `${connectionInfo.name} is disconnected`);
            delete connectionMap[connectionInfo.name];
        });

        connectionInfo.connection.openUri(connectionInfo.url, {useNewUrlParser: true})
            .catch(err => {
                console.error(TAG, `Error is occurred on connecting to ${connectionInfo.name}:\n`, err);
            });
    }

    return connectionInfo.connection;
};

// 새 DB를 연결하고 싶다면, 아래에 add 함수로 호출하세요.
// call `add` function if you want to connect new db.
add('FOMES', config.fomesDbUrl);

module.exports = connectionMap;
