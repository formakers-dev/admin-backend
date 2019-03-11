const chai = require('chai');
const should = chai.should();
const server = require('../app');
const request = require('supertest').agent(server);
const moxios = require('moxios');
const config = require('../config');
const Users = require('../model/users').Users;

require('../db').init();

describe('Notification', () => {
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
                "message": "메세지",

                // optional
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
                        const header = request.headers;

                        header.Authorization.should.be.eql('key=' + config.firebase_messaging.serverKey);
                        header['Content-Type'].should.be.eql('application/json');

                        const body = JSON.parse(request.config.data);

                        body.data.channel.should.be.eql('channel_announce');
                        body.data.title.should.be.eql('타이틀');
                        body.data.subTitle.should.be.eql('서브타이틀');
                        body.data.message.should.be.eql('메세지');
                        body.data.isSummary.should.be.eql(true);
                        body.data.summarySubText.should.be.eql('서머리서브텍스트');
                        body.data.deeplink.should.be.eql('딥링크');

                        body.registration_ids.length.should.be.eql(2);
                        body.registration_ids[0].should.be.eql('registrationToken1');
                        body.registration_ids[1].should.be.eql('registrationToken3');

                        done();
                    });
                }).catch(err => done(err));
        });
    });

    afterEach(() => {
        moxios.uninstall();
    });

    after(done => {
        Users.remove({}, done);
    });
});
