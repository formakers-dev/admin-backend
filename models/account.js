const mongoose = require('mongoose');
const db = require('../db');
const connection = db.ADMIN;

const Constants = {
    ROLE : {
        MASTER : '99'
    },
    STATUS : {
        PENDING : 'pending',
        ACTIVE : 'active',
        INACTIVE : 'inactive',
        LOCKED : 'locked',
    }
};

const schema = new mongoose.Schema({
    account : String,
    password : String,
    role : String,
    status : String,
    invalidPasswordCount: Number,
    createdAt: Date,        //가입일시
});

const Account = connection.model('account', schema);
module.exports = { Account, Constants };