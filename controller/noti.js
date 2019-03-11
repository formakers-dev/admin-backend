const axios = require('axios');
const config = require('../config');
const Users = require('../model/users').Users;

const sendNoti = (req, res) => {
    Users.find({ email: {$in: req.body.emails }}, {registrationToken: true})
        .then(users => {
            const body = {
                data: req.body.data,
                registration_ids: users.map(user => user.registrationToken),
            };

            const options = {
                headers: {
                    "Authorization": 'key=' + config.firebase_messaging.serverKey,
                    "Content-Type": 'application/json'
                }
            };

            return axios.post('https://fcm.googleapis.com/fcm/send', body, options);
        }).then(result => res.status(200).json({result : result}))
        .catch(err => res.status(500).json({error: err}));
};

module.exports = { sendNoti };
