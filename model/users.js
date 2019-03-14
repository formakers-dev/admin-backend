const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const db = require('../db');
const Schema = mongoose.Schema;

const Constants = {
    all: 0xFFFFFFFF,
    mine: 0x00000001,
    gender: 0x00000002,
    age: 0x00000004,
    job: 0x00000008,
};

const usersSchema = new Schema({
    userId : String,
    name: String,
    nickName: String,
    email : String,
    birthday: Number,
    job: Number,
    gender: String,
    registrationToken: String,
    provider: String,
    providerId: String,
    lastStatsUpdateTime: Date,
    signUpTime: Date,
    activatedDate: Date,
    lifeApps: Array,
    wishList: Array,
});

usersSchema.plugin(autoIncrement.plugin, 'users');

const Users = db.getConnection().model('users', usersSchema);
module.exports = { Users, Constants };
