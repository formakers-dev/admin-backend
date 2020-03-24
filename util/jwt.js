const JWT = require('jsonwebtoken');
const config = require('../config');

const JWT_CONSTANTS = {
    saltRounds: 10,
    // 1m => 60000, 1h => 3600000, 24h => 86400000
    expiration: process.env.NODE_ENV === 'development' ? 3600000 : 86400000
};
const generateToken = (req, res, payload) => {
    try{
        const token = JWT.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.NODE_ENV === 'development' ? '1h' : '1d',
        });
        // res.cookie('access_token', token, {
        //     expires: new Date(Date.now() + JWT_CONSTANTS.expiration),
        //     secure: config.frontendBaseUrl.startsWith('https'), //https option
        //     httpOnly: true,
        // });
        return token;
    }catch(err){
        console.error(err);
        res.sendStatus(500);
    }
};

const verify = (token) => {
    return JWT.verify(token, process.env.JWT_SECRET);
}
module.exports = {
    generateToken, verify, JWT_CONSTANTS
};

