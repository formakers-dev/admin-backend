const chai = require('chai');
const should = chai.should();
const server = require('../app');
const request = require('supertest').agent(server);
const Users = require('../models/users').Users;

describe('Users', () => {

    before(done => {
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

    describe('GET /users/:email/nick-name', () => {
        it('해당 이메일을 가지는 유저의 닉네임을 리턴한다', () => {
            request.get('/users/email3/nick-name')
                .expect(200)
                .then(res => {
                    res.data.should.be.eql("닉네임3");
                    done();
                }).catch(err => done(err));
        });
    });

    after(done => {
        Users.remove({}, done);
    });
});