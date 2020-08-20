const mongoose = require('mongoose');
const db = require('../db');
const connection = db.FOMES;
const Schema = mongoose.Schema;

const schema = new Schema({
  date: Date,
  userId: String,
  birthday: Number,
  job: Number,
  gender: String,
  packageName: String,
  appName: String,
  developer: String,
  categoryId: String,
  categoryName: String,
  iconUrl: String,
  totalUsedTime: Number,
  metaData: {
    updateTime: Date,
    appVersion: String,
    fomesAppVersion: String,
  },
});

module.exports = connection.model('app-usages', schema);

