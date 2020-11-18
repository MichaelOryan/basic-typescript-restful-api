import request from 'supertest';
import Server from '../src/server';
import PromiseExtended from './../src/util/promise';
import SupertestExtended from './../src/util/supertest';
// import { expect } from 'chai';
// import mocha from 'mocha';

const app = new Server().expressApp();

describe('GET non existant link for 404. Server exists and responds', function () {
  it('responds with json', function (done) {
    request(app)
      .get('/some/non/existant/path')
      .expect('Content-Type', /html/)
      .expect(404, done);
  });
});

describe('POST /sessions/reports', function () {
  it('responds with json', function (done) {
    request(app)
      .post('/sessions/reports')
      .send({ file: 'hello' })
      .expect('Content-Type', /json/)
      .expect(SupertestExtended.statusOf([201, 202]))
      .end(done);
  });
});

describe('GET /sessions/reports/:id', function () {
  it('responds with json for valid id', function () {
    let id = '';
    return Promise.resolve().then(getIdFromPostRequest).then(PromiseExtended.delay(1000)).then(getSummaryFromId);
    function getIdFromPostRequest() {
      return request(app)
        .post('/sessions/reports')
        .send({ file: 'hello' })
        .expect(SupertestExtended.statusOf([201, 202]))
        .expect(function (res) {
          id = res.body.id;
        });
    }
    function getSummaryFromId() {
      return request(app)
        .get(`/sessions/reports/${id}`)
        // TODO: clean this up :\
        .expect(() => {
          const checks = [() => typeof id === 'string', () => id.length > 0];
          // Values used for banned types are above in checks
          // eslint-disable-next-line @typescript-eslint/ban-types
          const isTrue = (f: Function) => f() === true;
          if (!checks.every(isTrue))
            throw new Error(`Invalid id of ${JSON.stringify(id)}`);
        })
        .expect('Content-Type', /json/)
        .expect(function (res) {
          if (!(Number(res.body.averagePageViewsPerDay) >= 0))
            throw new Error(
              `Invalid field value returned for averagePageViewsPerDay of ${res.body.averagePageViewsPerDay}`
            );
          if (!(Number(res.body.userSessionRatio) >= 0))
            throw new Error(
              `Invalid field value returned for userSessionRatio of ${res.body.userSessionRatio}`
            );
          if (!(Number(res.body.weeklyMaximumSessions) >= 0))
            throw new Error(
              `Invalid field value returned for weeklyMaximumSessions of ${res.body.weeklyMaximumSessions}`
            );
        })
        .expect(200);
    }
  });
});

describe('GET /sessions/reports/:id', function () {
  it('responds with 404 for invalid id', function () {
    return Promise.resolve().then(getSummaryFromId);
    function getSummaryFromId() {
      return request(app).get('/sessions/reports/some_invalid_id').expect(404);
    }
  });
});
