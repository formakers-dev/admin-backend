const chai = require('chai');
const should = chai.should();
const server = require('../app');
const request = require('supertest').agent(server);
const Users = require('../models/users').Users;
const config = require('../config');

describe('Users', () => {

    beforeEach(done => {
        Users.create([
            {
                userId: "userId1",
                email: "email1",
                nickName: "닉네임1",
                registrationToken: 'registrationToken1',
                activatedDate: new Date('2019-08-21'),
            },
            {
                userId: "userId2",
                email: "email2",
                nickName: "닉네임2",
                registrationToken: 'registrationToken2',
                activatedDate: new Date('2019-08-14'),
            },
            {
                userId: "userId3",
                email: "email3",
                nickName: "닉네임3",
                registrationToken: 'registrationToken3',
                activatedDate: new Date('2019-08-07'),
            },
        ], done);
    });

    describe.skip('GET /api/users/:email/nick-name', () => {
        it('해당 이메일을 가지는 유저의 닉네임을 리턴한다', done => {
            request.get('/users/email3/nick-name')
                .set('Authorization', config.accessToken.valid)
                .expect(200)
                .then(res => {
                    console.log(res.body)
                    res.body.nickName.should.be.eql("닉네임3");
                    done();
                }).catch(err => done(err));
        });

        it('해당 이메일을 가지는 유저가 없으면 204를 리턴한다', done => {
            request.get('/api/users/email9999/nick-name')
                .set('Authorization', config.accessToken.valid)
                .expect(204, done);
        });
    });

    afterEach(done => {
        Users.remove({}, done);
    });
});
