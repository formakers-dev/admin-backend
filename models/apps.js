const mongoose = require('mongoose');
const db = require('../db');
const connection = db.FOMES;
const Schema = mongoose.Schema;

const appSchema = new Schema({
    packageName: String,
    appName: String,
    categoryId1: String,
    categoryId2: String,
    categoryName1: String,
    categoryName2: String,
    categoryIds: Array,
    developer: String,
    iconUrl: String,
    star : Number,
    installsMin : Number,
    installsMax : Number,
    contentsRating : String,
    imageUrls : Array,
    wishedBy: Array,
});

module.exports = connection.model('apps', appSchema);
