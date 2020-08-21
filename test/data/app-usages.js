const mongoose = require('mongoose');
const PointConstants = require('../../models/point-records').Constants;

const ObjectId = mongoose.Types.ObjectId;
const ISODate = (ISODateString) => new Date(ISODateString);
const config = require('../../config');

const data = [
  {
    "_id" : ObjectId("5f158cc341bbfa0de4a89673"),
    "metaData" : {
      "updateTime" : ISODate("2020-07-20T12:23:31.879Z"),
      "appVersion" : "1.2.47",
      "fomesAppVersion" : "0.3.13"
    },
    "date" : ISODate("2020-07-20T00:00:00.000Z"),
    "userId" : "google116564685888623000997",
    "birthday" : 2005,
    "job" : 5001,
    "gender" : "male",
    "packageName" : "com.ha.mobi",
    "appName" : "모비 - 사전예약, 사전등록, 게임쿠폰",
    "developer" : "헝그리앱 Group",
    "categoryId" : "GAME_ROLE_PLAYING",
    "categoryName" : "롤플레잉",
    "iconUrl" : "https://lh3.googleusercontent.com/lsiXFOGmro6YqKkbrQwcdvIqXp6keIWJHX9Kn_IemlDiI1MPjRmqifbU5O2FQquKwQ=s180",
    "totalUsedTime" : 302240
  },
  {
    "_id" : ObjectId("5f15a96f41bbfa0de4aa4ae0"),
    "metaData" : {
      "updateTime" : ISODate("2020-07-20T14:25:51.070Z"),
      "appVersion" : "1.0.11",
      "fomesAppVersion" : "0.3.13"
    },
    "date" : ISODate("2020-07-20T00:00:00.000Z"),
    "userId" : "google110498765837834378025",
    "birthday" : 1987,
    "job" : 8000,
    "gender" : "male",
    "packageName" : "com.sundaytoz.kakao.anipang4",
    "appName" : "애니팡4",
    "developer" : "SUNDAYTOZ, INC",
    "categoryId" : "GAME_PUZZLE",
    "categoryName" : "퍼즐",
    "iconUrl" : "https://lh3.googleusercontent.com/csoGx-BI9yst0VYbyDk5ilDuvnsir-Js5FZ3JituFrUE6g3yM2LWbGb3kB0rGtu4pg=s180",
    "totalUsedTime" : 35368
  },
  {
    "_id" : ObjectId("5f15a96f41bbfa0de4aa4ade"),
    "metaData" : {
      "updateTime" : ISODate("2020-07-20T14:25:51.070Z"),
      "appVersion" : "1.6.7",
      "fomesAppVersion" : "0.3.13"
    },
    "date" : ISODate("2020-07-20T00:00:00.000Z"),
    "userId" : "google110498765837834378025",
    "birthday" : 1987,
    "job" : 8000,
    "gender" : "male",
    "packageName" : "com.kakaogames.gdtskr",
    "appName" : "가디언 테일즈",
    "developer" : "Kakao Games Corp.",
    "categoryId" : "GAME_ROLE_PLAYING",
    "categoryName" : "롤플레잉",
    "iconUrl" : "https://lh3.googleusercontent.com/B4S_Dq08JIJJiX2nhXbybMdFGD_715aoLCuFasbXlO9mFkM4dqCBq_lmYQpzNX76OpM=s180",
    "totalUsedTime" : 2717006
  }
];

module.exports = data;
