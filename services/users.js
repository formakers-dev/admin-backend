const Users = require('../models/users').Users;

const getNickName = (email) => {
    return Users.find({email : email}, {nickName : 1})
};

module.exports = {
    getNickName
};

