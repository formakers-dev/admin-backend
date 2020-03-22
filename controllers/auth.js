const AuthService = require('../services/auth');

const login = (req, res) => {
    console.log('login');
    try{
        return AuthService.login(req,res);
    }catch(err){
        console.error(err);
        return res.status(500).json({error : err.message});
    }
};
const signUp = (req, res) => {
    console.log('signUp');
    try{
        return AuthService.signUp(req, res);
    }catch(err){
        console.error(err);
        return res.status(500).json({error : err.message});
    }
};

const logout = (req, res) => {
    console.log('logout');
    try{
        return AuthService.logout(req, res);
    }catch(err){
        console.error(err);
        return res.status(500).json({error : err.message});
    }
}

const check = (req, res) => {
    return AuthService.check(req, res);
}
module.exports = { login, signUp, logout, check };
