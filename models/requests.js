const mongoose = require('mongoose');
const db = require('../db');
const connection = db.FOMES;
const Schema = mongoose.Schema;

const game = {
    title: String,
    tags: Array,
    description: String,
    downloadUrl: String,
    packageName: String,
    devProcess: Object,
};

const company = {
    name: String,
    class: String,
    numberOfEmployee: Number,
};

const customer = {
    referers: Array,
    name: String,
    role: String,
    phoneNumber: String,
    email: String,
};

const requestSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: Date,
    status: String,
    purpose: String,
    plan: String,
    numberOfTester: Number,
    openDate: Date,
    duration: Number,
    additionalInfo: String,
    isIncludedUserData: Boolean,
    isIncludedCustomizing: Boolean,
    customizingManagerEmails: Array,
    game: game,
    company: company,
    customer: customer,
    operatorAccountId: String,
    operatorName: String,
});

module.exports = connection.model('requests', requestSchema);
