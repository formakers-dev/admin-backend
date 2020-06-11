const mongoose = require('mongoose');
const db = require('../db');
const connection = db.FOMES;
const Schema = mongoose.Schema;

const Epilogue = {
    awards: String,
    deeplink: String,
    companyImageUrl: String,
    companySays: String,
    companyName: String,
};

const Rewards = {
    minimumDelay: Number,
    list: Array,
};

const betaTestSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    subjectType: String,
    plan: String,
    purpose: String,
    progressText: Object,
    tags: Array,
    coverImageUrl: String,
    iconImageUrl: String,
    openDate: Date,
    closeDate: Date,
    bugReport: Object,
    epilogue: Epilogue,
    rewards: Rewards,
    similarApps: Array,
    status: String,
    missionsSummary: String,
});

module.exports = connection.model('beta-tests', betaTestSchema);
