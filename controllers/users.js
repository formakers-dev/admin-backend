const UsersService = require('../services/users');

const getUsers = (req, res) => {
    try{
        if(req.query.type && req.query.keyword){
            console.log('getUser');
            return UsersService.getUser(req, res);
        }else{
            console.log('get all Users');
            return UsersService.getAllUsers(req, res);
        }
    }catch(err){
        console.error(err);
        return res.status(500).json({error : err.message});
    }
};

const getUsersByFilter = (req, res) => {
    try{
        return UsersService.getUsers(req, res);
    }catch(err){
        console.error(err);
        return res.status(500).json({error : err.message});
    }
};

const getAllUsers = (req, res) => {
    try{
        console.log('getAllUsers');
        return UsersService.getAllUsers(req, res);
    }catch(err){
        console.error(err);
        return res.status(500).json({error : err.message});
    }
};

module.exports = { getUsers, getUsersByFilter, getAllUsers };
