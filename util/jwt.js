const JWT = require('jsonwebtoken');
const config = require('../config');

const JWT_CONSTANTS = {
    saltRounds: 10,
};
const generateToken = (req, res, payload) => {
    try{
        return JWT.sign(payload, config.jwtSecret, {
            expiresIn: '1d'
        });
    }catch(err){
        throw err;
    }
};

const verify = (token) => {
    return JWT.verify(token, config.jwtSecret);
}
module.exports = {
    generateToken, verify, JWT_CONSTANTS
};

