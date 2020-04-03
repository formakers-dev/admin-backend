const mongoose = require('mongoose');
const db = require('../db');
const connection = db.FOMES;
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    title: String,
    tags: Array,
    description: String,
    downloadUrl: String,
    packageName: String,
    devProcess: Object,
});

const companySchema = new Schema({
    name: String,
    class: String,
    numberOfEmployee: Number,
});

const customerSchema = new Schema({
    referers: Array,
    name: String,
    role: String,
    phoneNumber: String,
    email: String,
});

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
    game: gameSchema,
    company: companySchema,
    customer: customerSchema,
    operatorAccountId: String,
    operatorName: String,
});

module.exports = connection.model('requests', requestSchema);
