const mongoose = require('mongoose');
const db = require('../db');
const connection = db.FOMES;
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const Constants = {
  TYPE: {
    SAVE: 1,
    EXCHANGE: 2,
  },
  STATUS: {
    COMPLETED: 1, // 완료
    REQUEST: 10, // 요청 (운영팀에 요청하는 경우)
    // 예정?
  }
};

const schema = new Schema({
  userId: String,
  date: Date,
  point: Number,
  type: Number,
  status: Number,
  description: String,
  metaData: {
    refType: String,
    refId: ObjectId,
  },
  operationData: {
    operatorAccountId: String,
  },

  // for exchange type
  phoneNumber: String,
});

const Model = connection.model('point-records', schema);

module.exports = {
  Model,
  Constants,
};
