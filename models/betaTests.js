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

const MissionItemSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    type: String,
    order: Number,
    title : String,
    actionType : String,
    action : String,
    postCondition : Object,
    completedUserIds : Array,
    options : Array,
    packageName: String,
});

const MissionSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    order : Number,
    title : String,
    description : String,
    descriptionImageUrl : String,
    iconImageUrl : String,
    items : [MissionItemSchema],
    guide : String,
});

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
    missions: [MissionSchema],
    similarApps: Array,
    status: String,
});

module.exports = connection.model('beta-tests', betaTestSchema);
