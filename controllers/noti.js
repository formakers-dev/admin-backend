const NotiService = require('../services/noti');
const agenda = require('../agenda');

const sendNoti = (req, res) => {
    console.log('sendNoti');

    if (req.body.when) {
        const when = new Date(req.body.when);
        console.log('Reserve notification at', when);

        agenda.schedule(when, 'Request notifications', req.body);

        res.sendStatus(200);
        return;
    }

    NotiService.request(req.body.emails, req.body.data)
        .then(result => res.status(200).json({result : result}))
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.message});
        });
};

const sendNotiByTopic = (req, res) => {
    console.log('sendNotiByTopic');

    if (req.body.when) {
        const when = new Date(req.body.when);
        console.log('Reserve notification at', when);

        agenda.schedule(when, 'Request notifications by topic', {
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