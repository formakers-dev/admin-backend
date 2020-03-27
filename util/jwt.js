const JWT = require('jsonwebtoken');
const config = require('../config');

const JWT_CONSTANTS = {
    saltRounds: 10,
};
const generateToken = (req, res, payload) => {
    try{
        const token = JWT.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });
        return token;
    }catch(err){
        console.error(err);
        throw err;
    }
};

const verify = (token) => {
    return JWT.verify(token, process.env.JWT_SECRET);
}
module.exports = {
    generateToken, verify, JWT_CONSTANTS
};

