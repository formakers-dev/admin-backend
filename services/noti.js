const axios = require('axios');
const Users = require('../models/users').Users;
const FirebaseUtil = require('../util/firebase');
const config = require('../config');

const request = (emails, data) => {
    return Users.find({ email: {$in: emails }}, {registrationToken: true})
        .then(users => {
            console.log('find user count=', users.length);

            const body = {
                data: data,
                registration_ids: users.map(user => user.registrationToken),
            };

            // [공식문서](https://firebase.google.com/docs/cloud-messaging/http-server-ref) 의 `data` 필드 설명 참고
            if (body.data.isSummary) {
                body.data.isSummary = body.data.isSummary.toString();
            }

            const options = {
                headers: {
                    "Authorization": 'key=' + config.firebase_messaging.serverKey,
                    "Content-Type": 'application/json'
                }
            };

            return axios.post('https://fcm.googleapis.com/fcm/send', body, options);
        }).then(result => Promise.resolve(result.data));
};

const requestByTopic = (topic, data) => {
    return FirebaseUtil.getAccessToken().then(firebaseAccessToken => {
        const body = {
            message: {
                topic: topic,
                data: data
            }
        };

        // [공식문서](https://firebase.google.com/docs/cloud-messaging/http-server-ref) 의 `data` 필드 설명 참고
        if (body.message.data.isSummary) {
            body.message.data.isSummary = body.message.data.isSummary.toString();
        }

        const options = {
            headers: {
                "Authorization": 'Bearer ' + firebaseAccessToken,
                "Content-Type": 'application/json'
            }
        };

        return axios.post('https://fcm.googleapis.com/v1/projects/'+ config.firebase.projectName +'/messages:send', body, options);
    }).then(result => Promise.resolve(result.data));
};

module.exports = { request, requestByTopic };
