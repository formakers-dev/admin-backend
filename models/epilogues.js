const mongoose = require('mongoose');
const db = require('../db');
const connection = db.FOMES;
const schema = new mongoose.Schema({
    betaTestId: mongoose.Schema.Types.ObjectId,
    companySays: String,
    deeplink: String,
});
module.exports = connection.model('epilogues', schema);
