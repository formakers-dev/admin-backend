const UsersService = require('../services/users');

const getUser = (req, res) => {
    try{
        return UsersService.getUser(req, res);
    }catch(err){
        console.error(err);
        return res.status(500).json({error : err.message});
    }
};

const getUsers = (req, res) => {
    try{
        return UsersService.getUsers(req, res);
    }catch(err){
        console.error(err);
        return res.status(500).json({error : err.message});
    }
};

module.exports = { getUser, getUsers };
