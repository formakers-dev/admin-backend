const JWT = require('jsonwebtoken');
const JWT_CONSTANTS = {
    saltRounds: 10,
    // 1m => 60000, 1h => 3600000, 24h => 86400000
    expiration: process.env.NODE_ENV === 'development' ? 3600000 : 86400000
};
const generateToken = (res, payload) => {
    const token = JWT.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.NODE_ENV === 'development' ? '1h' : '1d',
    });
    res.cookie('access_token', token, {
        expires: new Date(Date.now() + JWT_CONSTANTS.expiration),
        secure: false, //https option
        httpOnly: true,
    });
    return token;
};

const verify = (token) => {
    return JWT.verify(token, process.env.JWT_SECRET);
}
module.exports = {
    generateToken, verify, JWT_CONSTANTS
};

