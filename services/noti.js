const axios = require('axios');
const FirebaseUtil = require('../util/firebase');
const config = require('../config');

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

module.exports = { requestByTopic };
