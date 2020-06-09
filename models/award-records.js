const mongoose = require('mongoose');
const db = require('../db');
const connection = db.FOMES;

const Reward = {
    description: String,
    price: Number,
};

const AwardRecordsSchema = new mongoose.Schema({
    userId: String,
    nickName: String,
    betaTestId: mongoose.Schema.Types.ObjectId,
    type: String,
    typeCode: Number,
    reward: Reward
});

module.exports = connection.model('award-records', AwardRecordsSchema);
