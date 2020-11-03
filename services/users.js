const Users = require('../models/users').Users;

class NotExistUser extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

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

const getUsers = (type, keywords) => {
    const filter = {};
    filter[type] = {$in: keywords};

    return Users.find(filter, { _id: false }).lean();
};

const getAllUsers = (req, res) => {
    Users.find().lean().then(result => {
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
    getUser, getUsers, getAllUsers,
    NotExistUser
};

