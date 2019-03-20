const chai = require('chai');
const should = chai.should();
const sinon = require('sinon');
const server = require('../app');
const request = require('supertest').agent(server);
const moxios = require('moxios');
const config = require('../config');
const Users = require('../models/users').Users;
const FirebaseUtil = require('../util/firebase');
const agenda = require('../agenda');

describe('Notification', () => {
    const sandbox = sinon.createSandbox();

    before(done => {
        Users.create([
            {
                userId: "userId1",
                email: "email1",
                registrationToken: 'registrationToken1',
            },
            {
                userId: "userId2",
                email: "email2",
                registrationToken: 'registrationToken2',
            },
            {
                userId: "userId3",
                email: "email3",
                registrationToken: 'registrationToken3',
            }
        ], done);
    });

    beforeEach(() => {
        moxios.install();
    });

    describe('POST /noti', () => {

        const body = {
            "data": {
                "channel" : "channel_announce",
                "title": "타이틀",
                "subTitle": "서브타이틀",

                // optional
                "message": "메세지",
                "isSummary": true,
                "summarySubText": "서머리서브텍스트",
                "deeplink": "딥링크",
            },
            "emails": ["email1", "email3"]
        };

        it('전달된 이메일에 해당하는 유저에게 요청된 내용의 알림을 전송한다', done => {
            moxios.stubRequest('https://fcm.googleapis.com/fcm/send', {
                status: 200
            });

            request.post('/noti')
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
                        body.data.title.should.be.eql('타이틀');
                        body.data.subTitle.should.be.eql('서브타이틀');
                        body.data.message.should.be.eql('메세지');
                        body.data.isSummary.should.be.eql("true");
                        body.data.summarySubText.should.be.eql('서머리서브텍스트');
                        body.data.deeplink.should.be.eql('딥링크');

                        body.registration_ids.length.should.be.eql(2);
                        body.registration_ids[0].should.be.eql('registrationToken1');
                        body.registration_ids[1].should.be.eql('registrationToken3');

                        done();
                    });
                }).catch(err => done(err));
        });

        it('전달된 이메일에 해당하는 유저에게 요청된 내용의 알림 전송을 예약한다', done => {
            const spyOnAgendaSchedule = sandbox.spy(agenda, 'schedule');

            body.when = new Date('2019-03-14T15:30:00.000Z');

            request.post('/noti')
                .expect(200)
                .send(body)
                .then(() => {
                    spyOnAgendaSchedule.calledOnce.should.be.true;

                    spyOnAgendaSchedule.getCall(0).args[0].should.be.eql(new Date('2019-03-14T15:30:00.000Z'));
                    spyOnAgendaSchedule.getCall(0).args[1].should.be.eql('Request notifications');

                    const data = spyOnAgendaSchedule.getCall(0).args[2];
                    data.emails.length.should.be.eql(2);
                    data.emails[0].should.be.eql('email1');
                    data.emails[1].should.be.eql('email3');
                    data.data.channel.should.be.eql('channel_announce');
                    data.data.title.should.be.eql('타이틀');
                    data.data.subTitle.should.be.eql('서브타이틀');
                    data.data.message.should.be.eql('메세지');
                    data.data.isSummary.should.be.eql(true);
                    data.data.summarySubText.should.be.eql('서머리서브텍스트');
                    data.data.deeplink.should.be.eql('딥링크');

                    done();
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
                "title": "타이틀",
                "subTitle": "서브타이틀",

                // optional
                "message": "메세지",
                "isSummary": true,
                "summarySubText": "서머리서브텍스트",
                "deeplink": "딥링크",
            },
        };

        beforeEach(() => {
            sandbox.stub(FirebaseUtil, 'getAccessToken')
                .returns(Promise.resolve('testFirebaseAccessToken'));

            moxios.stubRequest('https://fcm.googleapis.com/v1/projects/appbeemobile/messages:send', {
                status: 200
            });
        });

        it('해당 topic을 구독하는 사용자들에게 알림을 전송한다', done => {
            request.post('/noti/topics/notice-all')
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
                        body.message.data.title.should.be.eql('타이틀');
                        body.message.data.subTitle.should.be.eql('서브타이틀');
                        body.message.data.message.should.be.eql('메세지');
                        body.message.data.isSummary.should.be.eql("true");
                        body.message.data.summarySubText.should.be.eql('서머리서브텍스트');
                        body.message.data.deeplink.should.be.eql('딥링크');

                        done();
                    });
                }).catch(err => done(err));
        });

        it('해당 topic을 구독하는 사용자들에게 알림 전송을 예약한다', done => {
            const spyOnAgendaSchedule = sandbox.spy(agenda, 'schedule');

            body.when = new Date('2019-03-14T15:30:00.000Z');

            request.post('/noti/topics/notice-all')
                .expect(200)
                .send(body)
                .then(() => {
                    spyOnAgendaSchedule.calledOnce.should.be.true;

                    spyOnAgendaSchedule.getCall(0).args[0].should.be.eql(new Date('2019-03-14T15:30:00.000Z'));
                    spyOnAgendaSchedule.getCall(0).args[1].should.be.eql('Request notifications by topic');

                    const data = spyOnAgendaSchedule.getCall(0).args[2];
                    data.topic.should.be.eql('notice-all');
                    data.data.channel.should.be.eql('channel_announce');
                    data.data.title.should.be.eql('타이틀');
                    data.data.subTitle.should.be.eql('서브타이틀');
                    data.data.message.should.be.eql('메세지');
                    data.data.isSummary.should.be.eql(true);
                    data.data.summarySubText.should.be.eql('서머리서브텍스트');
                    data.data.deeplink.should.be.eql('딥링크');

                    done();
                }).catch(err => done(err));
        });

        afterEach(() => {
            sandbox.restore();
        })

    });

    describe('GET /noti/reserved', () => {
        const agenda = require('../agenda');

        beforeEach(done => {
            agenda.schedule(new Date('2119-03-20T00:00:00.000Z'), 'Request notifications', {
                "data": {
                    "channel": "channel_announce",
                    "title": "타이틀",
                    "subTitle": "서브타이틀",

                    // optional
                    "message": "메세지",
                    "isSummary": true,
                    "summarySubText": "서머리서브텍스트",
                    "deeplink": "딥링크",
                },
                emails: ['email1', 'email2'],
                when: '2119-03-20T00:00:00.000Z',
            }).then(() => {
                return agenda.schedule(new Date('2119-03-21T00:00:00.000Z'), 'Request notifications by topic', {
                    "data": {
                        "channel": "channel_betatest",
                        "title": "타이틀2",
                        "subTitle": "서브타이틀2",

                        // optional
                        "message": "메세지2",
                        "isSummary": false,
                        "summarySubText": "서머리서브텍스트2",
                        "deeplink": "딥링크2",
                    },
                    emails: ['email3', 'email4'],
                    when: '2119-03-21T00:00:00.000Z',
                }).then(() => {
                    done();
                });
            });
        });

        it('예약한 알림 리스트를 전달한다', done => {
            request.get('/noti/reserved')
                .expect(200)
                .then(res => {
                    res.body.length.should.be.eql(2);

                    res.body[0]._id.should.be.exist;
                    res.body[0].data.data.channel.should.be.eql('channel_announce');
                    res.body[0].data.data.title.should.be.eql('타이틀');
                    res.body[0].data.data.subTitle.should.be.eql('서브타이틀');
                    res.body[0].data.data.message.should.be.eql('메세지');
                    res.body[0].data.data.isSummary.should.be.eql(true);
                    res.body[0].data.data.summarySubText.should.be.eql('서머리서브텍스트');
                    res.body[0].data.data.deeplink.should.be.eql('딥링크');
                    res.body[0].data.emails.should.be.eql(['email1', 'email2']);
                    res.body[0].nextRunAt.should.be.eql('2119-03-20T00:00:00.000Z');

                    res.body[1]._id.should.be.exist;
                    res.body[1].data.data.channel.should.be.eql('channel_betatest');
                    res.body[1].data.data.title.should.be.eql('타이틀2');
                    res.body[1].data.data.subTitle.should.be.eql('서브타이틀2');
                    res.body[1].data.data.message.should.be.eql('메세지2');
                    res.body[1].data.data.isSummary.should.be.eql(false);
                    res.body[1].data.data.summarySubText.should.be.eql('서머리서브텍스트2');
                    res.body[1].data.data.deeplink.should.be.eql('딥링크2');
                    res.body[1].data.emails.should.be.eql(['email3', 'email4']);
                    res.body[1].nextRunAt.should.be.eql('2119-03-21T00:00:00.000Z');

                    done();
                }).catch(err => done(err));
        });
    });

    describe('POST /noti/reserved/cancel', () => {
        const agenda = require('../agenda');

        beforeEach(done => {
            agenda.schedule(new Date('2119-03-20T00:00:00.000Z'), 'Request notifications', {
                "data": {
                    "channel": "channel_announce",
                    "title": "타이틀",
                    "subTitle": "서브타이틀",

                    // optional
                    "message": "메세지",
                    "isSummary": true,
                    "summarySubText": "서머리서브텍스트",
                    "deeplink": "딥링크",
                },
                emails: ['email1', 'email2'],
                when: '2119-03-20T00:00:00.000Z',
            }).then(() => {
                return agenda.schedule(new Date('2119-03-21T00:00:00.000Z'), 'Request notifications by topic', {
                    "data": {
                        "channel": "channel_betatest",
                        "title": "타이틀2",
                        "subTitle": "서브타이틀2",

                        // optional
                        "message": "메세지2",
                        "isSummary": false,
                        "summarySubText": "서머리서브텍스트2",
                        "deeplink": "딥링크2",
                    },
                    emails: ['email3', 'email4'],
                    when: '2119-03-21T00:00:00.000Z',
                }).then(() => {
                    done();
                });
            });
        });

        it('예약한 알림 리스트를 전달한다', done => {
            agenda.jobs({'data.data.title': '타이틀2'}).then(jobs => {
                const idsToCancel = jobs.map(job => job.attrs._id);
                console.log('idsToCancel', idsToCancel);
                return request.post('/noti/reserved/cancel')
                    .expect(200)
                    .send(idsToCancel);
            }).then(() => {
                return agenda.jobs({});
            }).then(jobs => {
                const actualJobs = jobs.map(job => job.attrs);

                actualJobs.length.should.be.eql(1);

                actualJobs[0]._id.should.be.exist;
                actualJobs[0].data.data.channel.should.be.eql('channel_announce');
                actualJobs[0].data.data.title.should.be.eql('타이틀');
                actualJobs[0].data.data.subTitle.should.be.eql('서브타이틀');
                actualJobs[0].data.data.message.should.be.eql('메세지');
                actualJobs[0].data.data.isSummary.should.be.eql(true);
                actualJobs[0].data.data.summarySubText.should.be.eql('서머리서브텍스트');
                actualJobs[0].data.data.deeplink.should.be.eql('딥링크');
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
                done();
            })
            .catch(err => done(err));
    });

    after(done => {
        Users.remove({}, done);
    });
});
