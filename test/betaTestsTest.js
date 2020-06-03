const chai = require('chai');
const should = chai.should();
const sinon = require('sinon');
const server = require('../app');
const request = require('supertest').agent(server);
const config = require('../config');

const BetaTests = require('../models/betaTests');

describe('Notification', () => {

  before(done => {
  });

  beforeEach(() => {
  });

  describe('POST /api/beta-test/', () => {
    it('ddd', done => {
      const data = require('data/register-beta-test');

      request.post('/api/beta-test')
        .set('Authorization', config.accessToken.valid)
        .expect(200)
        .send(data)
        .then(res => {
          console.log(res);
        }).catch(err => done(err));
    })
  });

  describe('GET /api/beta-test/', () => {

  });

  describe('PUT /api/beta-test/:id', () => {

  });

  afterEach(done => {
  });

  after(done => {
    BetaTests.remove({})
      .then(() => done())
      .catch(err => done(err));
  });
});
