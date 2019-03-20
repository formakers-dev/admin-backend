const mongoose = require('mongoose');
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

const getReservedNotiList = (req, res) => {
    console.log('getReservedNotiList');

    agenda.jobs({}).then((jobs) => {
        console.log('getReservedNotiList) jobs=', jobs.length);
        res.send(jobs);
    }).catch(err => {
        console.error(err);
        res.status(500).json({error: err.message});
    });
};

const cancelReservedNoti = (req, res) => {
    console.log('cancelReservedNoti');
    console.log(req.body);

    const objectIds = req.body.map(id => mongoose.Types.ObjectId(id));

    agenda.cancel({_id: {$in: objectIds}})
        .then(numRemoved => {
            console.log(numRemoved);
            res.sendStatus(200);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.message});
        });
};

module.exports = { sendNoti, sendNotiByTopic, getReservedNotiList, cancelReservedNoti };
