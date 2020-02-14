const axios = require('axios');
const Users = require('../models/users').Users;
const NotiHistories = require('../models/notiHistories').NotiHistories;
const NotiHistoryConstants = require('../models/notiHistories').Constants;
const FirebaseUtil = require('../util/firebase');
const config = require('../config');

const convertToNotiData = (data) => {
    // [공식문서](https://firebase.google.com/docs/cloud-messaging/http-server-ref) 의 `data` 필드 설명 참고
    if (data.isSummary) {
        data.isSummary = data.isSummary.toString();
    }

    return data;
};

const request = (receivers, data) => {
    const filter = { };

    if (receivers.isExcluded) {
        // 클라와 디비가 강한 디펜던시를 가지게 되서 좋지 않은 방법이지만...ㅠ
        filter[receivers.type] = {$nin: receivers.value};

        // 1000명이 넘는 알림 전송 요청을 피하기위한 임시코드
        // TODO: 토픽을 이용한 알림 전송 도입 시 삭제 필요
        const activatedDateConstraint = new Date();
        activatedDateConstraint.setDate(activatedDateConstraint.getDate() - 30);

        filter['activatedDate'] = {$gte: activatedDateConstraint};
    } else {
        // 클라와 디비가 강한 디펜던시를 가지게 되서 좋지 않은 방법이지만...ㅠ
        filter[receivers.type] = {$in: receivers.value};
    }

    console.log(filter);

    return Users.find(filter, {registrationToken: true})
        .then(users => {
            console.log('find user count=', users.length);

            const body = {
                data: convertToNotiData(data),
                registration_ids: users.map(user => user.registrationToken),
            };

            const options = {
                headers: {
                    "Authorization": 'key=' + config.firebase_messaging.serverKey,
                    "Content-Type": 'application/json'
                }
            };

            return axios.post('https://fcm.googleapis.com/fcm/send', body, options);
        }).then(result => {
            insertIndividualHistory(null, receivers, data, NotiHistoryConstants.STATUS.SUCCESS);
            return Promise.resolve(result.data);
        }).catch(err => {
            insertIndividualHistory(null, receivers, data, NotiHistoryConstants.STATUS.FAILURE);
            return Promise.reject(err);
        });
};

const requestByTopic = (topic, data) => {
    return FirebaseUtil.getAccessToken().then(firebaseAccessToken => {
        const body = {
            message: {
                topic: topic,
                data: convertToNotiData(data)
            }
        };

        const options = {
            headers: {
                "Authorization": 'Bearer ' + firebaseAccessToken,
                "Content-Type": 'application/json'
            }
        };

        return axios.post('https://fcm.googleapis.com/v1/projects/'+ config.firebase.projectName +'/messages:send', body, options);
    }).then(result => {
        insertTopicHistory(topic, null, data, NotiHistoryConstants.STATUS.SUCCESS);
        return Promise.resolve(result.data);
    }).catch(err => {
        insertTopicHistory(topic, null, data, NotiHistoryConstants.STATUS.FAILURE);
        return Promise.reject(err);
    });
};

// 멀티 커넥션 점검 위한 임시 서비스 함수 insert***History
const insertIndividualHistory = (when, receivers, data, status) => {
    insertHistory(NotiHistoryConstants.TYPE.INDIVIDUAL, when, receivers, data, status);
};

const insertTopicHistory = (topic, when, data, status) => {
    insertHistory(topic, when, null, data, status);
};

const insertHistory = (type, when, receivers, data, status) => {
    new NotiHistories({
        type : type,
        when : ((when) ? new Date(when) : null),
        receivers : receivers,
        data : data,
        createdAt : new Date(),
        status : status
    }).save()
        .then(() => console.log("NotiHistory Inserted!"))
        .catch(err => console.log(err));
};

module.exports = { request, requestByTopic };
