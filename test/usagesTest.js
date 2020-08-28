const chai = require('chai');
const should = chai.should();
const server = require('../app');
const request = require('supertest').agent(server);
const AppUsages = require('../models/app-usages');
const config = require('../config');

describe('Usages', () => {
  const usageData = require('./data/app-usages');

  beforeEach(done => {
    AppUsages.create(usageData, done);
  });

  describe('GET /api/usages/game', () => {
    it('게임 플레이 데이터를 모두 조회한다', done => {
      request.get('/api/usages/game')
        .set('Authorization', config.accessToken.valid)
        .expect(200)
        .then(res => {
          console.log(res.body);
          res.body.length.should.be.eql(usageData.length);
          done();
        }).catch(err => done(err));
    });
  });

  describe('GET /api/usages/game?app_name={appName}', () => {
    it('해당 앱의 게임 플레이 데이터 조회한다', done => {
      request.get('/api/usages/game?app_name=' + encodeURIComponent("애니팡"))
        .set('Authorization', config.accessToken.valid)
        .expect(200)
        .then(res => {
          res.body.length.should.be.eql(2);
          done();
        }).catch(err => done(err));
    });
  });


  describe('GET /api/usages/game?package_name={pacakgeName}', () => {
    it('해당 앱의 게임 플레이 데이터를 모두 조회한다', done => {
      request.get('/api/usages/game?package_name=com.sundaytoz.kakao.anipang4')
        .set('Authorization', config.accessToken.valid)
        .expect(200)
        .then(res => {
          res.body.length.should.be.eql(2);
          done();
        }).catch(err => done(err));
    });
  });


  afterEach(done => {
    AppUsages.remove({}, done);
  });
});
