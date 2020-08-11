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

    NotiService.request(req.body.receivers, req.body.data)
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

const sendPointNoti = (req, res) => {
    console.log('sendPointNoti');

    const pointNotiMap = req.body.reduce((map, pointNotiData) => {
        console.log(pointNotiData);
        const key = pointNotiData.point + "_" + pointNotiData.award.typeCode;

        if (!!!map[key]) {
            map[key] = {
                userIds: [pointNotiData.userId],
                point: pointNotiData.point,
                award: pointNotiData.award,
                betaTest: pointNotiData.betaTest,
            };
        } else {
            map[key].userIds.push(pointNotiData.userId);
        }

        return map;
    }, {});

    const keys = Object.keys(pointNotiMap);
    keys.forEach(key => {
        const receivers = {
            type: 'userId',
            value: pointNotiMap[key].userIds
        };

        NotiService.request(receivers, {
            channel: 'channel_point',
            title: '💰 ' + pointNotiMap[key].point.toLocaleString() + '포인트 적립 💰',
            subTitle: '👏 ' + pointNotiMap[key].betaTest.title + ' - ' + pointNotiMap[key].award.title + '으로 선정되었습니다!',
        })
        .then(users => {
            console.log(users ? users.length : 0 + '건의 포인트 지급 알림이 전송되었음');
        })
        .catch(err => {
            console.error(err);
        });
    });

    res.sendStatus(200);
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

    console.log(objectIds);
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
const updateReservedNoti = (req, res) => {
    console.log('updateReservedNoti');
    console.log(req.body);

    let objectIds = [];
    objectIds.push(req.body._id.toString());

    agenda.cancel({_id: {$in: objectIds}})
        .then(numRemoved => {
            sendNoti(req, res);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.message});
        });

};

const updateReservedNotiByTopic = (req, res) => {
    console.log('updateReservedNotiByTopic');
    console.log(req.body);

    let objectIds = [];
    objectIds.push(req.body._id.toString());

    agenda.cancel({_id: {$in: objectIds}})
        .then(numRemoved => {
            sendNotiByTopic(req, res);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: err.message});
        });

};

module.exports = {
    sendNoti,
    sendNotiByTopic,
    sendPointNoti,
    getReservedNotiList,
    cancelReservedNoti,
    updateReservedNoti,
    updateReservedNotiByTopic
};
