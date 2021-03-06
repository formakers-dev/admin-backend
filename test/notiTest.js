const chai = require('chai');
const should = chai.should();
const sinon = require('sinon');
const server = require('../app');
const request = require('supertest').agent(server);
const moxios = require('moxios');
const axios = require('axios');
const config = require('../config');
const Users = require('../models/users').Users;
const FirebaseUtil = require('../util/firebase');
const agenda = require('../agenda');

describe('Notification', () => {
    const sandbox = sinon.createSandbox();

    beforeEach(done => {
        moxios.install();

        Users.remove({})
            .then(() =>
            Users.create([
                {
                    userId: "userId1",
                    email: "email1",
                    registrationToken: 'registrationToken1',
                    activatedDate: new Date('2019-08-21'),
                },
                {
                    userId: "userId2",
                    email: "email2",
                    registrationToken: 'registrationToken2',
                    activatedDate: new Date('2019-08-14'),
                },
                {
                    userId: "userId3",
                    email: "email3",
                    registrationToken: 'registrationToken3',
                    activatedDate: new Date('2019-08-07'),
                },
                {
                    userId: "userId4",
                    email: "email4",
                    registrationToken: 'registrationToken4',
                    activatedDate: new Date('2019-07-31'),
                },
                {
                    userId: "userId5",
                    email: "email5",
                    registrationToken: 'registrationToken5',
                    activatedDate: new Date('2019-07-22'),
                },
                {
                    userId: "userId6",
                    email: "email6",
                    registrationToken: 'registrationToken6',
                    activatedDate: new Date('2019-07-21'),
                }
            ], done));
    });

    describe('GET /noti/reserved', () => {

        beforeEach(done => {
            agenda.schedule(new Date('2119-03-20T00:00:00.000Z'), 'Request notifications', {
                "data": {
                    "channel": "channel_announce",
                    "title": "?????????",
                    "subTitle": "???????????????",

                    // optional
                    "message": "?????????",
                    "isSummary": true,
                    "summarySubText": "????????????????????????",
                    "deeplink": "?????????",
                },
                emails: ['email1', 'email2'],
                when: '2119-03-20T00:00:00.000Z',
            }).then(() => {
                return agenda.schedule(new Date('2119-03-21T00:00:00.000Z'), 'Request notifications by topic', {
                    "data": {
                        "channel": "channel_betatest",
                        "title": "?????????2",
                        "subTitle": "???????????????2",

                        // optional
                        "message": "?????????2",
                        "isSummary": false,
                        "summarySubText": "????????????????????????2",
                        "deeplink": "?????????2",
                    },
                    emails: ['email3', 'email4'],
                    when: '2119-03-21T00:00:00.000Z',
                }).then(() => {
                    done();
                });
            });
        });

        it('????????? ?????? ???????????? ????????????', done => {
            console.log(config.accessToken.valid);
            request.get('/api/noti/reserved')
                .set('Authorization', config.accessToken.valid)
                .expect(200)
                .then(res => {
                    console.log(res.body);
                    res.body.length.should.be.eql(2);

                    res.body[0]._id.should.be.exist;
                    res.body[0].data.data.channel.should.be.eql('channel_announce');
                    res.body[0].data.data.title.should.be.eql('?????????');
                    res.body[0].data.data.subTitle.should.be.eql('???????????????');
                    res.body[0].data.data.message.should.be.eql('?????????');
                    res.body[0].data.data.isSummary.should.be.eql(true);
                    res.body[0].data.data.summarySubText.should.be.eql('????????????????????????');
                    res.body[0].data.data.deeplink.should.be.eql('?????????');
                    res.body[0].data.emails.should.be.eql(['email1', 'email2']);
                    res.body[0].nextRunAt.should.be.eql('2119-03-20T00:00:00.000Z');

                    res.body[1]._id.should.be.exist;
                    res.body[1].data.data.channel.should.be.eql('channel_betatest');
                    res.body[1].data.data.title.should.be.eql('?????????2');
                    res.body[1].data.data.subTitle.should.be.eql('???????????????2');
                    res.body[1].data.data.message.should.be.eql('?????????2');
                    res.body[1].data.data.isSummary.should.be.eql(false);
                    res.body[1].data.data.summarySubText.should.be.eql('????????????????????????2');
                    res.body[1].data.data.deeplink.should.be.eql('?????????2');
                    res.body[1].data.emails.should.be.eql(['email3', 'email4']);
                    res.body[1].nextRunAt.should.be.eql('2119-03-21T00:00:00.000Z');

                    done();
                }).catch(err => done(err));
        });
    });

    describe('POST /noti', () => {

        describe('????????? ???????????? ????????? ??????', () => {
            const body = {
                "data": {
                    "channel": "channel_announce",
                    "title": "?????????",
                    "subTitle": "???????????????",

                    // optional
                    "message": "?????????",
                    "isSummary": true,
                    "summarySubText": "????????????????????????",
                    "deeplink": "?????????",
                },
                receivers: {
                    type: "email",
                    value: ["email1", "email3"]
                }
            };

            it('???????????? ???????????? ????????? ????????? ????????? ????????????', done => {
                moxios.stubRequest('https://fcm.googleapis.com/fcm/send', {
                    status: 200
                });

                request.post('/api/noti')
                    .set('Authorization', config.accessToken.valid)
                    .expect(200)
                    .send(body)
                    .then(() => {
                        moxios.wait(() => {
                            const request = moxios.requests.mostRecent();

                            const url = request.url;
                            url.should.be.eql('https://fcm.googleapis.com/fcm/send');

                            const header = request.headers;
                            header.Authorization.should.be.eql('key=' + config.firebase_messaging.serverKey);
                            header['Content-Type'].should.be.eql('application/json');

                            const body = JSON.parse(request.config.data);
                            body.data.channel.should.be.eql('channel_announce');
                            body.data.title.should.be.eql('?????????');
                            body.data.subTitle.should.be.eql('???????????????');
                            body.data.message.should.be.eql('?????????');
                            body.data.isSummary.should.be.eql("true");
                            body.data.summarySubText.should.be.eql('????????????????????????');
                            body.data.deeplink.should.be.eql('?????????');

                            body.registration_ids.length.should.be.eql(2);
                            const actualRegistrationIds = body.registration_ids.sort((a, b) => a > b ? 1 : -1);
                            console.log(actualRegistrationIds)
                            actualRegistrationIds[0].should.be.eql('registrationToken1');
                            actualRegistrationIds[1].should.be.eql('registrationToken3');

                            done();
                        });
                    }).catch(err => done(err));
            });

            it('???????????? ???????????? ????????? ????????? ?????? ????????? ????????????', done => {
                const spyOnAgendaSchedule = sandbox.spy(agenda, 'schedule');

                body.when = new Date('2019-03-14T15:30:00.000Z');

                request.post('/api/noti')
                    .set('Authorization', config.accessToken.valid)
                    .expect(200)
                    .send(body)
                    .then(() => {
                        spyOnAgendaSchedule.calledOnce.should.be.true;

                        spyOnAgendaSchedule.getCall(0).args[0].should.be.eql(new Date('2019-03-14T15:30:00.000Z'));
                        spyOnAgendaSchedule.getCall(0).args[1].should.be.eql('Request notifications');

                        const data = spyOnAgendaSchedule.getCall(0).args[2];
                        data.receivers.value.length.should.be.eql(2);
                        data.receivers.value[0].should.be.eql('email1');
                        data.receivers.value[1].should.be.eql('email3');
                        data.data.channel.should.be.eql('channel_announce');
                        data.data.title.should.be.eql('?????????');
                        data.data.subTitle.should.be.eql('???????????????');
                        data.data.message.should.be.eql('?????????');
                        data.data.isSummary.should.be.eql(true);
                        data.data.summarySubText.should.be.eql('????????????????????????');
                        data.data.deeplink.should.be.eql('?????????');

                        done();
                    }).catch(err => done(err));
            });
        });

        describe('????????? ?????? ???????????? ????????? ??????', () => {
            const body = {
                "data": {
                    "channel" : "channel_announce",
                    "title": "?????????",
                    "subTitle": "???????????????",

                    // optional
                    "message": "?????????",
                    "isSummary": true,
                    "summarySubText": "????????????????????????",
                    "deeplink": "?????????",
                },
                receivers: {
                    type: "userId",
                    value : ["userId1", "userId3"]
                }
            };

            it('???????????? ???????????? ????????? ????????? ????????? ????????????', done => {
                moxios.stubRequest('https://fcm.googleapis.com/fcm/send', {
                    status: 200
                });

                request.post('/api/noti')
                    .set('Authorization', config.accessToken.valid)
                    .expect(200)
                    .send(body)
                    .then(() => {
                        moxios.wait(() => {
                            const request = moxios.requests.mostRecent();

                            const url = request.url;
                            url.should.be.eql('https://fcm.googleapis.com/fcm/send');

                            const header = request.headers;
                            header.Authorization.should.be.eql('key=' + config.firebase_messaging.serverKey);
                            header['Content-Type'].should.be.eql('application/json');

                            const body = JSON.parse(request.config.data);
                            body.data.channel.should.be.eql('channel_announce');
                            body.data.title.should.be.eql('?????????');
                            body.data.subTitle.should.be.eql('???????????????');
                            body.data.message.should.be.eql('?????????');
                            body.data.isSummary.should.be.eql("true");
                            body.data.summarySubText.should.be.eql('????????????????????????');
                            body.data.deeplink.should.be.eql('?????????');

                            body.registration_ids.length.should.be.eql(2);
                            body.registration_ids[0].should.be.eql('registrationToken1');
                            body.registration_ids[1].should.be.eql('registrationToken3');

                            done();
                        });
                    }).catch(err => done(err));
            });

            it('???????????? ???????????? ????????? ????????? ?????? ????????? ????????????', done => {
                const spyOnAgendaSchedule = sandbox.spy(agenda, 'schedule');

                body.when = new Date('2019-03-14T15:30:00.000Z');

                request.post('/api/noti')
                    .set('Authorization', config.accessToken.valid)
                    .expect(200)
                    .send(body)
                    .then(() => {
                        spyOnAgendaSchedule.calledOnce.should.be.true;

                        spyOnAgendaSchedule.getCall(0).args[0].should.be.eql(new Date('2019-03-14T15:30:00.000Z'));
                        spyOnAgendaSchedule.getCall(0).args[1].should.be.eql('Request notifications');

                        const data = spyOnAgendaSchedule.getCall(0).args[2];
                        data.receivers.value.length.should.be.eql(2);
                        data.receivers.value[0].should.be.eql('userId1');
                        data.receivers.value[1].should.be.eql('userId3');
                        data.data.channel.should.be.eql('channel_announce');
                        data.data.title.should.be.eql('?????????');
                        data.data.subTitle.should.be.eql('???????????????');
                        data.data.message.should.be.eql('?????????');
                        data.data.isSummary.should.be.eql(true);
                        data.data.summarySubText.should.be.eql('????????????????????????');
                        data.data.deeplink.should.be.eql('?????????');

                        done();
                    }).catch(err => done(err));
            });

        });

        describe('?????? ????????? ????????? ??????????????? ????????? ????????? ??????', () => {
            const body = {
                "data": {
                    "channel" : "channel_announce",
                    "title": "?????????",
                    "subTitle": "???????????????",

                    // optional
                    "message": "?????????",
                    "isSummary": true,
                    "summarySubText": "????????????????????????",
                    "deeplink": "?????????",
                },
                receivers: {
                    type: "userId",
                    value : ["userId1", "userId3"],
                    isExcluded: true
                }
            };

            it('?????? ??????????????? ????????? ?????? 30??? ?????? ???????????? ????????????.', done => {
                sandbox.useFakeTimers(new Date("2019-08-21T00:00:00.000Z").getTime());
                const stubAxiosPost = sandbox.stub(axios, 'post')
                    .returns(Promise.resolve({data: 'test'}));

                request.post('/api/noti')
                    .set('Authorization', config.accessToken.valid)
                    .expect(200)
                    .send(body)
                    .then(() => {
                        const url = stubAxiosPost.getCall(0).args[0];
                        url.should.be.eql('https://fcm.googleapis.com/fcm/send');

                        const registration_ids = [
                            'registrationToken2',
                            'registrationToken4',
                            'registrationToken5'
                        ];

                        const body = stubAxiosPost.getCall(0).args[1];

                        body.data.channel.should.be.eql('channel_announce');
                        body.data.title.should.be.eql('?????????');
                        body.data.subTitle.should.be.eql('???????????????');
                        body.data.message.should.be.eql('?????????');
                        body.data.isSummary.should.be.eql("true");
                        body.data.summarySubText.should.be.eql('????????????????????????');
                        body.data.deeplink.should.be.eql('?????????');
                        body.registration_ids.length.should.be.eql(3);
                        body.registration_ids.should.have.members(registration_ids);

                        const header = stubAxiosPost.getCall(0).args[2].headers;
                        header.Authorization.should.be.eql('key=' + config.firebase_messaging.serverKey);
                        header['Content-Type'].should.be.eql('application/json');

                        done();
                    }).catch(err => done(err));
            });
        });

        afterEach(() => {
            sandbox.restore();
        })

    });

    describe('POST /noti/point', () => {
        const requestBody = [
            {
                userId: "userId1",
                point: 30000,
                award: {
                    typeCode: 9000,
                    title: '????????? ??????'
                },
                betaTest: {
                    _id: '5eb3b605bb2696f03826e0a6',
                    title: '[?????????????????????] ?????? ?????????',
                }
            },
            {
                userId: "userId2",
                point: 30000,
                award: {
                    typeCode: 9000,
                    title: '????????? ??????'
                },
                betaTest: {
                    _id: '5eb3b605bb2696f03826e0a6',
                    title: '[?????????????????????] ?????? ?????????',
                }
            },
            {
                userId: "userId3",
                point: 1000,
                award: {
                    typeCode: 1000,
                    title: '??????'
                },
                betaTest: {
                    _id: '5eb3b605bb2696f03826e0a6',
                    title: '[?????????????????????] ?????? ?????????',
                }
            }
        ];

        function assertPointNoti(request, expectedDataMap) {
            const url = request.url;
            url.should.be.eql('https://fcm.googleapis.com/fcm/send');

            const header = request.headers;
            header.Authorization.should.be.eql('key=' + config.firebase_messaging.serverKey);
            header['Content-Type'].should.be.eql('application/json');

            const body = JSON.parse(request.config.data);
            body.data.channel.should.be.eql(expectedDataMap.channel);
            body.data.title.should.be.eql(expectedDataMap.title);
            body.data.subTitle.should.be.eql(expectedDataMap.subTitle);
            body.data.deeplink.should.be.eql('fomes://point/history');

            body.registration_ids.length.should.be.eql(expectedDataMap.registrationIds.length);
            const actualRegistrationIds = body.registration_ids.sort((a, b) => a - b);
            actualRegistrationIds.forEach((actual, index) => actual.should.be.eql(expectedDataMap.registrationIds[index]));
        }

        it('?????? ???????????? ?????? ????????? ????????????', done => {
            moxios.stubRequest('https://fcm.googleapis.com/fcm/send', {
                status: 200
            });

            request.post('/api/noti/point')
                .set('Authorization', config.accessToken.valid)
                .expect(200)
                .send(requestBody)
                .then(() => {
                    moxios.wait(() => {
                        const requests = [];
                        for (let i = 0; i < moxios.requests.count(); i++) {
                            requests.push(moxios.requests.at(i));
                        }
                        const sortedRequests = requests.sort((a, b) => JSON.parse(a.config.data).data.title > JSON.parse(b.config.data).data.title ? -1 : 1);

                        assertPointNoti(sortedRequests[0], {
                            channel: "channel_point",
                            title: "???? 30,000????????? ?????? ????",
                            subTitle: '???? [?????????????????????] ?????? ????????? - ????????? ???????????? ?????????????????????!',
                            registrationIds:['registrationToken1', 'registrationToken2']
                        });

                        assertPointNoti(sortedRequests[1], {
                            channel: "channel_point",
                            title: "???? 1,000????????? ?????? ????",
                            subTitle: '???? [?????????????????????] ?????? ????????? - ???????????? ?????????????????????!',
                            registrationIds:['registrationToken3']
                        });

                        done();
                    });
                }).catch(err => done(err));
        });

        afterEach(() => {
            sandbox.restore();
        })

    });

    describe('POST /noti/topics/{topic}', () => {

        const body = {
            "data": {
                "channel" : "channel_announce",
                "title": "?????????",
                "subTitle": "???????????????",

                // optional
                "message": "?????????",
                "isSummary": true,
                "summarySubText": "????????????????????????",
                "deeplink": "?????????",
            },
        };

        beforeEach(() => {
            sandbox.stub(FirebaseUtil, 'getAccessToken')
                .returns(Promise.resolve('testFirebaseAccessToken'));

            moxios.stubRequest('https://fcm.googleapis.com/v1/projects/appbeemobile/messages:send', {
                status: 200
            });
        });

        it('?????? topic??? ???????????? ?????????????????? ????????? ????????????', done => {
            request.post('/api/noti/topics/notice-all')
                .set('Authorization', config.accessToken.valid)
                .expect(200)
                .send(body)
                .then(() => {
                    moxios.wait(() => {
                        const request = moxios.requests.mostRecent();

                        const url = request.url;
                        url.should.be.eql('https://fcm.googleapis.com/v1/projects/appbeemobile/messages:send');

                        const header = request.headers;
                        header.Authorization.should.be.eql('Bearer testFirebaseAccessToken');
                        header['Content-Type'].should.be.eql('application/json');

                        const body = JSON.parse(request.config.data);
                        body.message.topic.should.be.eql('notice-all');
                        body.message.data.channel.should.be.eql('channel_announce');
                        body.message.data.title.should.be.eql('?????????');
                        body.message.data.subTitle.should.be.eql('???????????????');
                        body.message.data.message.should.be.eql('?????????');
                        body.message.data.isSummary.should.be.eql("true");
                        body.message.data.summarySubText.should.be.eql('????????????????????????');
                        body.message.data.deeplink.should.be.eql('?????????');

                        done();
                    });
                }).catch(err => done(err));
        });

        it('?????? topic??? ???????????? ?????????????????? ?????? ????????? ????????????', done => {
            const spyOnAgendaSchedule = sandbox.spy(agenda, 'schedule');

            body.when = new Date('2019-03-14T15:30:00.000Z');

            request.post('/api/noti/topics/notice-all')
                .set('Authorization', config.accessToken.valid)
                .expect(200)
                .send(body)
                .then(() => {
                    spyOnAgendaSchedule.calledOnce.should.be.true;

                    spyOnAgendaSchedule.getCall(0).args[0].should.be.eql(new Date('2019-03-14T15:30:00.000Z'));
                    spyOnAgendaSchedule.getCall(0).args[1].should.be.eql('Request notifications by topic');

                    const data = spyOnAgendaSchedule.getCall(0).args[2];
                    data.topic.should.be.eql('notice-all');
                    data.data.channel.should.be.eql('channel_announce');
                    data.data.title.should.be.eql('?????????');
                    data.data.subTitle.should.be.eql('???????????????');
                    data.data.message.should.be.eql('?????????');
                    data.data.isSummary.should.be.eql(true);
                    data.data.summarySubText.should.be.eql('????????????????????????');
                    data.data.deeplink.should.be.eql('?????????');

                    done();
                }).catch(err => done(err));
        });

        afterEach(() => {
            sandbox.restore();
        })

    });

    describe('POST /noti/reserved/cancel', () => {

        beforeEach(done => {
            agenda.schedule(new Date('2119-03-20T00:00:00.000Z'), 'Request notifications', {
                "data": {
                    "channel": "channel_announce",
                    "title": "?????????",
                    "subTitle": "???????????????",

                    // optional
                    "message": "?????????",
                    "isSummary": true,
                    "summarySubText": "????????????????????????",
                    "deeplink": "?????????",
                },
                emails: ['email1', 'email2'],
                when: '2119-03-20T00:00:00.000Z',
            }).then(() => {
                return agenda.schedule(new Date('2119-03-21T00:00:00.000Z'), 'Request notifications by topic', {
                    "data": {
                        "channel": "channel_betatest",
                        "title": "?????????2",
                        "subTitle": "???????????????2",

                        // optional
                        "message": "?????????2",
                        "isSummary": false,
                        "summarySubText": "????????????????????????2",
                        "deeplink": "?????????2",
                    },
                    emails: ['email3', 'email4'],
                    when: '2119-03-21T00:00:00.000Z',
                }).then(() => {
                    done();
                });
            });
        });

        it('?????? ?????? ????????? ????????????', done => {
            agenda.jobs({'data.data.title': '?????????2'}).then(jobs => {
                const idsToCancel = jobs.map(job => job.attrs._id);
                console.log('idsToCancel', idsToCancel);
                return request.post('/api/noti/reserved/cancel')
                    .set('Authorization', config.accessToken.valid)
                    .expect(200)
                    .send(idsToCancel);
            }).then(() => {
                return agenda.jobs({});
            }).then(jobs => {
                const actualJobs = jobs.map(job => job.attrs);

                actualJobs.length.should.be.eql(1);

                actualJobs[0]._id.should.be.exist;
                actualJobs[0].data.data.channel.should.be.eql('channel_announce');
                actualJobs[0].data.data.title.should.be.eql('?????????');
                actualJobs[0].data.data.subTitle.should.be.eql('???????????????');
                actualJobs[0].data.data.message.should.be.eql('?????????');
                actualJobs[0].data.data.isSummary.should.be.eql(true);
                actualJobs[0].data.data.summarySubText.should.be.eql('????????????????????????');
                actualJobs[0].data.data.deeplink.should.be.eql('?????????');
                actualJobs[0].data.emails.should.be.eql(['email1', 'email2']);
                actualJobs[0].nextRunAt.should.be.eql(new Date('2119-03-20T00:00:00.000Z'));

                done();
            }).catch(err => done(err));
        });
    });


    afterEach(done => {
        moxios.uninstall();

        agenda.jobs({})
            .then(jobs => {
                jobs.forEach(job => job.remove());
                return Users.remove({});
            })
            .then(() => done())
            .catch(err => done(err));
    });
});
