const chai = require('chai');
const should = chai.should();
const sinon = require('sinon');
const server = require('../app');
const request = require('supertest').agent(server);
const config = require('../config');

const BetaTests = require('../models/betaTests');
const BetaTestMissions = require('../models/betaTestMissions');

describe('BetaTest', () => {

  before(done => {
    BetaTests.create(require('./data/beta-tests.js'))
      .then(() => BetaTestMissions.create(require('./data/missions.js')))
      .then(() => done())
      .catch(err => done(err));
  });

  beforeEach(() => {
  });

  describe('POST /api/beta-test/', () => {
    it('ddd', done => {
      const data = require('./data/register-beta-test');

      request.post('/api/beta-test')
        .set('Authorization', config.accessToken.valid)
        .expect(200)
        .send(data)
        .then(res => {
          console.log(res);
          done();
        }).catch(err => done(err));
    })
  });

  describe('GET /api/beta-test/', () => {

  });

  describe('PUT /api/beta-test/:id', () => {

  });

  describe('GET /api/beta-test/:id/mission/:missionId/feedback', () => {
    it('해당 미션의 응답 집계 스프레드 시트를 읽어 반환한다', done => {
      request.get('/api/beta-test/5c25e1e824196d19231fbed3/mission/5d199927839927107f4bb940/feedback')
        .set('Authorization', config.accessToken.valid)
        .expect(200)
        .then(res => {
          console.log(res.body);
          done();
        }).catch(err => done(err));
    })
  });

  afterEach(() => {
  });

  after(done => {
    BetaTests.remove({})
      .then(() => BetaTestMissions.remove({}))
      .then(() => done())
      .catch(err => done(err));
  });
});
