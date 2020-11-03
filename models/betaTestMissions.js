const mongoose = require('mongoose');
const db = require('../db');
const connection = db.FOMES;

const schema = new mongoose.Schema({
    betaTestId: mongoose.Schema.Types.ObjectId,
    order: Number,
    title: String,
    description: String,
    descriptionImageUrl: String,
    guide: String,
    deeplink: String,
    options: Array,
    type: String,

    // play type - optional
    packageName: String,

    // 임시
    actionType: String,
    action: String,
    feedbackAggregationUrl: String,
});

module.exports = connection.model('missions', schema);
