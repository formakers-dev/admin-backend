const axios = require('axios');
const config = require('../config');
const Users = require('../model/users').Users;
const FirebaseUtil = require('../util/firebase');

const sendNoti = (req, res) => {
    Users.find({ email: {$in: req.body.emails }}, {registrationToken: true})
        .then(users => {
            const body = {
                data: req.body.data,
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
        }).then(result => res.status(200).json({result : result.data}))
        .catch(err => res.status(500).json({error: err.message}));
};

const sendNotiByTopic = (req, res) => {
    FirebaseUtil.getAccessToken().then(firebaseAccessToken => {

        const body = {
            message: {
                topic: req.params.topic,
                data: req.body.data
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

    }).then(result => res.status(200).json({result : result.data}))
    .catch(err => res.status(500).json({error: err.message}));
};

module.exports = { sendNoti, sendNotiByTopic };
