const chai = require('chai');
const should = chai.should();
const server = require('../app');
const request = require('supertest').agent(server);
const PointRecords = require('../models/point-records').Model;
const PointConstants = require('../models/point-records').Constants;
const config = require('../config');

describe('PointRecords', () => {

    before(done => {
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

    after(done => {
        PointRecords.remove({}, done);
    });
});
