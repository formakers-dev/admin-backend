const mongoose = require('mongoose');
const db = require('../db');
const connection = db.FOMES;
const Schema = mongoose.Schema;

const EpilogueSchema = new Schema({
    awards: String,
    deeplink: String,
    companySays: String,
});

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
    overviewImageUrl: String,
    coverImageUrl: String,
    iconImageUrl: String,
    openDate: Date,
    closeDate: Date,
    bugReport: Object,
    epilogue: EpilogueSchema,
    rewards: Rewards,
    similarApps: Array,
    status: String,
});

module.exports = connection.model('beta-tests', betaTestSchema);
