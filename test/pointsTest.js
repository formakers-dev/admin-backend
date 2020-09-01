const chai = require('chai');
const should = chai.should();
const server = require('../app');
const request = require('supertest').agent(server);
const PointRecords = require('../models/point-records').Model;
const PointConstants = require('../models/point-records').Constants;
const config = require('../config');

describe('PointRecords', () => {

    beforeEach(done => {
        PointRecords.create(require('./data/point-records'), done);
    });

    describe('GET /api/points?type=exchange', () => {
        it('교환 타입 목록만을 반환한다', done => {
            request.get('/api/points?type=exchange')
                .set('Authorization', config.accessToken.valid)
                .expect(200)
                .then(res => {
                    console.log(res.body);

                    res.body.filter(item => item.type === PointConstants.TYPE.EXCHANGE)
                        .length.should.be.eql(res.body.length);

                    done();
                }).catch(err => done(err));
        });
    });

    describe('PUT /api/points/:id/exchange', () => {
        it('교환 요청에 대한 운영 측 완료처리를 수행한다', done => {
            const requestedExchangePointRecordId = '5efaee3be03734ef5dadb881';

            request.put('/api/points/' + requestedExchangePointRecordId + '/exchange')
                .set('Authorization', config.accessToken.valid)
                .expect(200)
                .send({
                    operationStatus: PointConstants.OPERATION_STATUS.COMPLETED,
                    operatorAccount: 'jason.ryu@formakers.net',
                    memo: '아무메모나...',
                })
                .then(() => PointRecords.findById(requestedExchangePointRecordId))
                .then(pointRecord => {
                    console.log(pointRecord);

                    pointRecord.type.should.be.eql(PointConstants.TYPE.EXCHANGE);
                    pointRecord.point.should.be.eql(-10000);
                    pointRecord.status.should.be.eql(PointConstants.STATUS.COMPLETED);
                    pointRecord.operationData.status.should.be.eql(PointConstants.OPERATION_STATUS.COMPLETED);
                    pointRecord.operationData.operatorAccount.should.be.eql('jason.ryu@formakers.net');
                    pointRecord.operationData.memo.should.be.eql('아무메모나...');

                    done();
                }).catch(err => done(err));
        });

        it('교환 요청에 대한 운영 측 실패처리를 수행한다', done => {
            const completedExchangePointRecordId = '5efaee3be03734ef5dadb888';

            request.put('/api/points/' + completedExchangePointRecordId + '/exchange')
                .set('Authorization', config.accessToken.valid)
                .expect(200)
                .send({
                    operationStatus: PointConstants.OPERATION_STATUS.FAILED,
                    operatorAccount: 'jason.ryu@formakers.net',
                    memo: '아무메모나...',
                })
                .then(() => PointRecords.findById(completedExchangePointRecordId))
                .then(pointRecord => {
                    console.log(pointRecord);

                    pointRecord.type.should.be.eql(PointConstants.TYPE.EXCHANGE);
                    pointRecord.point.should.be.eql(-5000);
                    pointRecord.status.should.be.eql(PointConstants.STATUS.REQUESTED);
                    pointRecord.operationData.status.should.be.eql(PointConstants.OPERATION_STATUS.FAILED);
                    pointRecord.operationData.operatorAccount.should.be.eql('jason.ryu@formakers.net');
                    pointRecord.operationData.memo.should.be.eql('아무메모나...');

                    done();
                }).catch(err => done(err));
        });
    });


    describe('DELETE /api/points/beta-test/:betaTestId/save', () => {
        it('특정 베타테스트 및 특정 유저의 적립 포인트 삭제 요청 시, 해당 포인트 이력을 삭제한다', done => {
            const betaTestId = '5dd38c8cb1e19307f5fce299';
            const awardRecordIds = ['111111111111111111111115', '111111111111111111111114'];

            request.delete('/api/points/beta-test/' + betaTestId + '/save')
                .set('Authorization', config.accessToken.valid)
                .expect(200)
                .send({awardRecordIds: awardRecordIds})
                .then(() => PointRecords.find({
                    'metaData.betaTestId': betaTestId,
                    'metaData.awardRecordId': { $in: awardRecordIds }
                }))
                .then(pointRecords => {
                    console.log(pointRecords);
                    pointRecords.length.should.be.eql(0);

                    // 그 외 이력들이 삭제되지 않았는지 확인
                    return PointRecords.find({
                        'metaData.betaTestId': betaTestId,
                    });
                })
                .then(pointRecords => {
                    console.log(pointRecords);
                    pointRecords.length.should.be.eql(1);
                    done();
                }).catch(err => done(err));
        });
    });

    afterEach(done => {
        PointRecords.remove({}, done);
    });
});
