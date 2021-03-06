const mongoose = require('mongoose');
const PointConstants = require('../../models/point-records').Constants;

const ObjectId = mongoose.Types.ObjectId;
const ISODate = (ISODateString) => new Date(ISODateString);
const config = require('../../config');

const data = [
    {
        "_id" : ObjectId("5efaedeae03734ef5dad8c10"),
        "userId" : "googleUserId",
        "date" : ISODate("2020-06-30T00:00:00.000Z"),
        "point" : 1000,
        "type" : PointConstants.TYPE.SAVE,
        "status" : PointConstants.STATUS.COMPLETED,
        "description" : "더팜 게임테스트 성실상",
        "metaData" : {
            "betaTestId" : ObjectId("5dd38c8cb1e19307f5fce299"),
            "awardRecordId" : ObjectId("111111111111111111111111"),
        }
    },
    {
        "_id" : ObjectId("5efaee3be03734ef5dadb888"),
        "userId" : "googleUserId",
        "date" : ISODate("2020-07-01T00:00:00.000Z"),
        "point" : -5000,
        "type" : PointConstants.TYPE.EXCHANGE,
        "status" : PointConstants.STATUS.COMPLETED,
        "description" : "문화상품권 1장 교환 신청",
        "metaData" : {
            "type" : "giftCertificate5000",
            "count" : 1
        },
        "operationData" : {
            "operatorAccountId" : "op@formakers.net"
        },
        "phoneNumber" : '010-1111-2222'
    },
    {
        "_id" : ObjectId("5efaee3be03734ef5dada401"),
        "userId" : "googleUserId",
        "date" : ISODate("2020-06-29T00:00:00.000Z"),
        "point" : 30000,
        "type" : PointConstants.TYPE.SAVE,
        "status" : PointConstants.STATUS.COMPLETED,
        "description" : "마이컬러링 게임테스트 수석",
        "metaData" : {
            "betaTestId" : ObjectId("5de748053ae42700175f6849"),
            "awardRecordId" : ObjectId("111111111111111111111112"),
        }
    },
    {
        "_id" : ObjectId("5efaee3be03734ef5dada999"),
        "userId" : "user1",
        "date" : ISODate("2020-05-15T00:00:00.000Z"),
        "point" : 5000,
        "type" : PointConstants.TYPE.SAVE,
        "status" : PointConstants.STATUS.COMPLETED,
        "description" : "고양이숲 게임테스트 수석",
        "metaData" : {
            "betaTestId" : ObjectId("5cb3ef0db5e8fc246c3b6c18"),
            "awardRecordId" : ObjectId("111111111111111111111113"),
        }
    },
    {
        "_id" : ObjectId("5efaee3be03734ef5dadb881"),
        "userId" : "googleUserId2",
        "date" : ISODate("2020-07-01T00:00:00.001Z"),
        "point" : -10000,
        "type" : PointConstants.TYPE.EXCHANGE,
        "status" : PointConstants.STATUS.REQUESTED,
        "description" : "문화상품권 2장 교환 신청",
        "metaData" : {
            "type" : "giftCertificate5000",
            "count" : 2,
        },
        "phoneNumber" : '010-1111-3333'
    },
    {
        "_id" : ObjectId("5efaee3be03734ef5dadb884"),
        "userId" : "googleUserId3",
        "date" : ISODate("2020-07-11T00:00:00.001Z"),
        "point" : -20000,
        "type" : PointConstants.TYPE.EXCHANGE,
        "status" : PointConstants.STATUS.REQUESTED,
        "description" : "문화상품권 4장 교환 신청",
        "metaData" : {
            "type" : "giftCertificate5000",
            "count" : 4,
        },
        "operationData" : {
            "operatorAccountId" : "jason@formakers.net"
        },
        "phoneNumber" : '010-1111-5555'
    },
    {
        "_id" : ObjectId("5efaedeae03734ef5dad8fff"),
        "userId" : config.fomesUser.userId,
        "date" : ISODate("2020-06-30T00:00:00.000Z"),
        "point" : 1000,
        "type" : PointConstants.TYPE.SAVE,
        "status" : PointConstants.STATUS.COMPLETED,
        "description" : "더팜 게임테스트 성실상",
        "metaData" : {
            "betaTestId" : ObjectId("5dd38c8cb1e19307f5fce299"),
            "awardRecordId" : ObjectId("111111111111111111111114"),
        }
    },
    {
        "_id" : ObjectId("5efaedeae03734ef5dad8ff0"),
        "userId" : config.fomesUser.userId,
        "date" : ISODate("2020-06-30T00:00:00.000Z"),
        "point" : 1000,
        "type" : PointConstants.TYPE.SAVE,
        "status" : PointConstants.STATUS.COMPLETED,
        "description" : "더팜 게임테스트 성실상2",
        "metaData" : {
            "betaTestId" : ObjectId("5dd38c8cb1e19307f5fce299"),
            "awardRecordId" : ObjectId("111111111111111111111115"),
        }
    },
];

module.exports = data;
