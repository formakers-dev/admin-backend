const Users = require('../models/users').Users;

const getUser = (req, res) => {
    const type = req.query.type;
    const keyword = req.query.keyword;
    if(type !=='email' && type !=='userId' && type !=='nickName'){
        return res.status(400).json({error:'잘못된 타입입니다.'});
    }
    const filter = {};
    filter[type] = keyword;
    Users.find(filter,(err, result)=>{
       if(err){
           console.error(error);
           throw err;
       }
       if(!result){
           return res.sendStatus(204);
       }
       return res.status(200).json(result);
    });
};

const getUsers = (req, res) => {
    const type = req.body.type;
    const keywords = req.body.keywords;
    if(type !=='email' && type !=='userId' && type !=='nickName'){
        return res.status(400).json({error:'잘못된 타입입니다.'});
    }
    const filter = {};
    filter[type] = {$in: keywords};
    Users.find(filter,(err, result)=>{
        if(err){
            console.error(error);
            throw err;
        }
        if(!result){
            return res.sendStatus(204);
        }
        return res.status(200).json(result);
    });
};

const getAllUsers = (req, res) => {
    Users.find().then(result => {
        if(!result){
            return res.sendStatus(204);
        }
        return res.status(200).json(result);
    }).catch(error => {
        console.error(error);
        throw error;
    });
};

module.exports = {
    getUser, getUsers, getAllUsers
};

