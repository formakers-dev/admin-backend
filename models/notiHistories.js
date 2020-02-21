// 멀티 커넥션 점검 위한 임시 모델
const mongoose = require('mongoose');
const db = require('../db');
const connection = db.ADMIN;

const Constants = {
    TYPE : {
        INDIVIDUAL : 'individual'
    },
    STATUS : {
        SUCCESS : 'success',
        FAILURE : 'failure'
    }
};

const schema = new mongoose.Schema({
    type : String,          //individual : 개별노티, topic types
    when : Date,             // 발송 예약시간
    receivers : Array,      // 수신자 목록
    data : Object,
    createdAt: Date,           // 로그 생성일시
    status : String         // success : 성공, failure : 실패
});

const NotiHistories = connection.model('noti-histories', schema);
module.exports = { NotiHistories, Constants };
