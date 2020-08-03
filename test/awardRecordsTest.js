const chai = require('chai');
const should = chai.should();
const server = require('../app');
const request = require('supertest').agent(server);
const ObjectId = require('mongoose').Types.ObjectId;
const Users = require('../models/users').Users;
const PointRecords = require('../models/point-records').Model;
const PointConstants = require('../models/point-records').Constants;
const config = require('../config');

describe('AwardRecords', () => {

    beforeEach(done => {
        Users.create([{userId: 'userId1'}, {userId: 'userId2'}])
          .then(() => PointRecords.create(require('./data/point-records')))
          .then(() => done())
          .catch(err => done(err));
    });

    describe('PUT /api/award-records/', () => {
        it('수상자 등록 시 지급 타입이 포인트면, 포인트가 적립된다', done => {
            const requestBody = {
                userIdentifier: {
                    type: 'userId',
                    data: ['userId1', 'userId2']
                },
                betaTestId: new ObjectId('123456789012345678901234'),
                award: {
                    type: 'best',
                    typeCode: 9000,
                },
                reward: {
                    description : "오처넌 포인트다",
                    price : 5000,
                    paymentType : 'point',
                },
            };

            request.post('/api/award-records/')
                .set('Authorization', config.accessToken.valid)
                .expect(200)
                .send(requestBody)
                .then(() => PointRecords.find({
                    userId: {$in: requestBody.userIdentifier.data},
                    type: PointConstants.TYPE.SAVE,
                    status: PointConstants.STATUS.COMPLETED,
                    "metaData.refType" : "beta-test",
                    "metaData.refId": requestBody.betaTestId
                }))
                .then(res => {
                    console.log(res)
                    res.length.should.be.eql(2);
                    const pointRecords = res.sort((a,b) => a.userId - b.userId);

                    pointRecords[0].userId.should.be.eql('userId1');
                    pointRecords[0].point.should.be.eql(5000);

                    pointRecords[1].userId.should.be.eql('userId2');
                    pointRecords[1].point.should.be.eql(5000);
                  done();
                }).catch(err => done(err));
        });

      it('수상자 등록 시, 유저데이터가 없으면 204를 리턴하고 아무런 행동을 하지 않는다', done => {
        const requestBody = {
          userIdentifier: {
            type: 'userId',
            data: ['userId0', 'userId-1']
          },
          betaTestId: new ObjectId('123456789012345678901234'),
          award: {
            type: 'best',
            typeCode: 9000,
          },
          reward: {
            description : "오처넌 포인트다",
            price : 5000,
            paymentType : 'point',
          },
        };

        request.post('/api/award-records/')
          .set('Authorization', config.accessToken.valid)
          .expect(204)
          .send(requestBody)
          .then(() => PointRecords.find({
            userId: {$in: requestBody.userIdentifier.data},
            type: PointConstants.TYPE.SAVE,
            status: PointConstants.STATUS.COMPLETED,
            "metaData.refType" : "beta-test",
            "metaData.refId": requestBody.betaTestId
          }))
          .then(res => {
            console.log(res)
            res.length.should.be.eql(0);
            done();
          }).catch(err => done(err));
      });

      it('수상자 등록 시, 지급 타입이 포인트가 아니면 포인트 등록을 수행하지 않는다', done => {
        const requestBody = {
          userIdentifier: {
            type: 'userId',
            data: ['userId1', 'userId2']
          },
          betaTestId: new ObjectId('123456789012345678901234'),
          award: {
            type: 'best',
            typeCode: 9000,
          },
          reward: {
            description : "오처넌 포인트다",
            price : 5000,
            paymentType : 'etc',
          },
        };

        request.post('/api/award-records/')
          .set('Authorization', config.accessToken.valid)
          .expect(200)
          .send(requestBody)
          .then(() => PointRecords.find({
            userId: {$in: requestBody.userIdentifier.data},
            type: PointConstants.TYPE.SAVE,
            status: PointConstants.STATUS.COMPLETED,
            "metaData.refType" : "beta-test",
            "metaData.refId": requestBody.betaTestId
          }))
          .then(res => {
            res.length.should.be.eql(0);
            done();
          }).catch(err => done(err));
      });
    });



    afterEach(done => {
        Users.remove({})
          .then(() => PointRecords.remove({}))
          .then(() => done())
          .catch(err => done(err));
    });
});
