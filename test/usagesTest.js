const chai = require('chai');
const should = chai.should();
const server = require('../app');
const request = require('supertest').agent(server);
const AppUsages = require('../models/app-usages');
const config = require('../config');

describe('Usages', () => {

  beforeEach(done => {
    AppUsages.create(require('./data/app-usages'), done);
  });

  describe('GET /api/usages/game', () => {
    it('게임 플레이 데이터를 모두 조회한다', done => {
      request.get('/api/usages/game')
        .set('Authorization', config.accessToken.valid)
        .expect(200)
        .then(res => {
          console.log(res.body);
          res.body.length.should.be.eql(3);
          done();
        }).catch(err => done(err));
    });
  });

  afterEach(done => {
    AppUsages.remove({}, done);
  });
});
