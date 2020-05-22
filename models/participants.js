const mongoose = require('mongoose');
const db = require('../db');
const connection = db.FOMES;
const Schema = mongoose.Schema;

const participantSchema = new Schema({
    userId: String,
    betaTestId: mongoose.Schema.Types.ObjectId,
    missionId: mongoose.Schema.Types.ObjectId,
    type: String,
    status: String,
    date: Date
});
module.exports = connection.model('participations', participantSchema);
