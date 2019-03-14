const axios = require('axios');
const config = require('../config');
const Users = require('../models/users').Users;
const NotiService = require('../services/noti');
const agenda = require('../agenda');

const sendNoti = (req, res) => {
    console.log('sendNoti');

    Users.find({ email: {$in: req.body.emails }}, {registrationToken: true})
        .then(users => {
            console.log('find user count=', users.length);

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
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.message});
        });
};

const sendNotiByTopic = (req, res) => {
    console.log('sendNotiByTopic');

    if (req.body.when) {
        const when = new Date(req.body.when);
        // const when = moment(req.body.when).format('LT');

        const cronFormat = when.getUTCSeconds() + " "
            + when.getUTCMinutes() + " "
            + when.getUTCHours() + " "
            + when.getUTCDate() + " "
            + (when.getUTCMonth() + 1) + " *";

        agenda.schedule(cronFormat, 'Request notifications', {
            data: req.body.data,
            topic: req.params.topic
        });

        res.sendStatus(200);
        return;
    }

    NotiService.requestByTopic(req.params.topic, req.body.data)
        .then(result => res.status(200).json({result : result}))
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.message});
        });
};

module.exports = { sendNoti, sendNotiByTopic };
