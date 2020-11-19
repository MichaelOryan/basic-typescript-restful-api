import request from 'supertest';
import Server from '../src/server';
import PromiseExtended from './../src/util/promise';
import SupertestExtended from './../src/util/supertest';
import path from 'path';
// import { expect } from 'chai';
// import mocha from 'mocha';

const app = new Server().expressApp();

const csvSampleFile = path.resolve(__dirname, './../../test', './testData/reports/Analytics-20201001-20201031.csv');

describe('GET non existant link for 404. Server exists and responds', function () {
  it('responds with 404', function () {
    return request(app)
      .get('/some/non/existant/path')
      .expect('Content-Type', /html/)
      .expect(404);
      
  });
});

// Marked for deletion. Use actual file now
// describe('POST /sessions/reports', function () {
//   it('responds with json', function () {
//     return request(app)
//       .post('/sessions/reports')
//       .send({ file: 'hello' })
//       .expect('Content-Type', /json/)
//       .expect(SupertestExtended.statusOf([201, 202]));
//   });
// });

describe('POST /sessions/reports actual file', function () {
  it('responds with json', function () {
    return request(app)
      .post('/sessions/reports')
      .attach('file', csvSampleFile)
      .expect('Content-Type', /json/)
      .expect(SupertestExtended.statusOf([201, 202]));
  });
});

// Marked for deletion. Use specific routes
// describe('GET /sessions/reports/:id', function () {
//   it('responds with json for valid id', function () {
//     let id = '';
//     return Promise.resolve().then(getIdFromPostRequest).then(PromiseExtended.delay(1000)).then(getSummaryFromId);
//     function getIdFromPostRequest() {
//       return request(app)
//         .post('/sessions/reports')
//         // .send({ file: 'hello' })
//         .attach('file', csvSampleFile)
//         .expect(SupertestExtended.statusOf([201, 202]))
//         .expect(function (res) {
//           id = res.body.id;
//         });
//     }
//     function getSummaryFromId() {
//       return request(app)
//         .get(`/sessions/reports/${id}`)
//         // TODO: clean this up :\
//         .expect(() => {
//           const checks = [() => typeof id === 'string', () => id.length > 0];
//           // Values used for banned types are above in checks
//           // eslint-disable-next-line @typescript-eslint/ban-types
//           const isTrue = (f: Function) => f() === true;
//           if (!checks.every(isTrue))
//             throw new Error(`Invalid id of ${JSON.stringify(id)}`);
//         })
//         .expect('Content-Type', /json/)
//         .expect(function (res) {
//           if (!(Number(res.body.averagePageViewsPerDay) >= 0))
//             throw new Error(
//               `Invalid field value returned for averagePageViewsPerDay of ${res.body.averagePageViewsPerDay}`
//             );
//           if (!(Number(res.body.userSessionRatio) >= 0))
//             throw new Error(
//               `Invalid field value returned for userSessionRatio of ${res.body.userSessionRatio}`
//             );
//           if (!(Number(res.body.weeklyMaximumSessions) >= 0))
//             throw new Error(
//               `Invalid field value returned for weeklyMaximumSessions of ${res.body.weeklyMaximumSessions}`
//             );
//         })
//         .expect(200);
//     }
//   });
// });


describe('GET /sessions/reports/:id/status', function () {
  it('responds with ok for finalised report', function () {
    let id = '';
    return Promise.resolve().then(getIdFromPostRequest).then(PromiseExtended.delay(1000)).then(getSummaryFromId);
    function getIdFromPostRequest() {
      return request(app)
        .post('/sessions/reports')
        // .send({ file: 'hello' })
        .attach('file', csvSampleFile)
        .expect(SupertestExtended.statusOf([201, 202]))
        .expect(function (res) {
          id = res.body.id;
        });
    }
    function getSummaryFromId() {
      return request(app)
        .get(`/sessions/reports/${id}/status`)
        // TODO: clean this up :\
        .expect(() => {
          const checks = [() => typeof id === 'string', () => id.length > 0];
          // Values used for banned types are above in checks
          // eslint-disable-next-line @typescript-eslint/ban-types
          const isTrue = (f: Function) => f() === true;
          if (!checks.every(isTrue))
            throw new Error(`Invalid id of ${JSON.stringify(id)}`);
        })
        .expect(200);
    }
  });
  it('reponse for a valid id but not yet built report', function () {
    let id = '';
    return Promise.resolve().then(getIdFromPostRequest).then(getSummaryFromId);
    function getIdFromPostRequest() {
      return request(app)
        .post('/sessions/reports')
        // .send({ file: 'hello' })
        .attach('file', csvSampleFile)
        .expect(SupertestExtended.statusOf([201, 202]))
        .expect(function (res) {
          id = res.body.id;
        });
    }
    function getSummaryFromId() {
      return request(app)
        .get(`/sessions/reports/${id}/status`)
        .expect(() => {
          const checks = [() => typeof id === 'string', () => id.length > 0];
          // Values used for banned types are above in checks
          // eslint-disable-next-line @typescript-eslint/ban-types
          const isTrue = (f: Function) => f() === true;
          if (!checks.every(isTrue))
            throw new Error(`Invalid id of ${JSON.stringify(id)}`);
        })
        .expect(503);
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

describe('GET /sessions/reports/:id/status', function () {
  it('GET /sessions/reports/:id/status for non existant report', function () {
    return Promise.resolve().then(getSummaryFromId);
    function getSummaryFromId() {
      return request(app).get('/sessions/reports/some_invalid_id/status').expect(404);
    }
  });

  
});

// I will need to do some tests here for actual parsing of data to generate results for the endpoints.
// Should be okay to do now for some simple tests. Can expand later on if additional params are added from user requirements.

// routes/reports to test

// const averageDailyPageViewsPath = () => reportByIdPath() + '/average-daily-pageviews';
// const userToSessionRatioPath = () => reportByIdPath() + '/user-to-session-ratio';
// const weeklyMaximumSessionsPath = () => reportByIdPath() + '/weekly-maximum-sessions';

describe('GET /sessions/reports/:id/ average daily page views', function () {
  it('responds with data for valid id', function () {
    let id = '';
    return Promise.resolve().then(getIdFromPostRequest).then(PromiseExtended.delay(1000)).then(getSummaryFromId);
    function getIdFromPostRequest() {
      return request(app)
        .post('/sessions/reports')
        .attach('file', csvSampleFile)
        .expect(SupertestExtended.statusOf([201, 202]))
        .expect(function (res) {
          id = res.body.id;
        });
    }
    function getSummaryFromId() {
      return request(app)
        .get(`/sessions/reports/${id}/average-daily-pageviews`)
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
          const expectedTrafficTypes = ['organic', 'direct', 'referral', 'paid', 'email', 'social', 'display-retargeting', 'sponsored', 'AdVendorPage'];
          if (!(expectedTrafficTypes.every(type => type in res.body)))
            throw new Error(
              `Missing expected traffic types of ${expectedTrafficTypes.filter(type => !(type in res.body.averagePageViewsPerDay)).join(',')} for average pageviews by traffic type`
            );          
        })
        .expect(200);
    }
  });

  
});

// describe('GET /sessions/reports/:id/ user session ratio', function () {
  
// });

// describe('GET /sessions/reports/:id/ weekly maximum sessions', function () {
  
// });