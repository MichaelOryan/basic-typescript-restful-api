import request from 'supertest';
import Server from '../src/server';
import { expect } from 'chai';
import mocha from 'mocha';
import Summary from './../src/components/reports/summary/summary.interface';

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
      // .expect('Content-Length',JSON.stringify({id: 'some id'}).length.toString())
      .expect(200, done);
  });
});
describe('GET /sessions/reports/:id', function () {
  it('responds with json for valid id', function () {
    let id = '';
    return Promise.resolve().then(getIdFromPostRequest).then(getSummaryFromId);
    function getIdFromPostRequest() {
      return request(app)
        .post('/sessions/reports')
        .send({ file: 'hello' })
        .expect(200)
        .expect(function (res) {
          id = res.body.id;
        });
    }
    function getSummaryFromId() {
      return request(app)
        .get(`/sessions/reports/${id}`)
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
    let id = '';
    return (
      Promise.resolve()
        // .then(getIdFromPostRequest)
        .then(getSummaryFromId)
    );
    function getIdFromPostRequest() {
      return request(app)
        .post('/sessions/reports')
        .expect(200)
        .expect(function (res) {
          id = res.body.id;
        });
    }
    function getSummaryFromId() {
      return (
        request(app)
          .get(`/sessions/reports/${id}_invalid_id`)
          //   .expect("Content-Type", /html/)
          .expect(404)
      );
    }
  });
});
