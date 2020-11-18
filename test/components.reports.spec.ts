import request from 'supertest';
import Server from '../src/server';
import { expect } from 'chai';
import mocha from 'mocha';

const app = new Server().expressApp();

describe('GET non existant link for 404. Server exists and responds', function() {
	it('responds with json', function(done) {
		request(app)
			.get('/some/non/existant/path')
			.expect('Content-Type', /html/)
			.expect(404, done);
	});
});

describe('POST /sessions/reports', function() {
	it('responds with json', function(done) {
		request(app)
			.post('/sessions/reports')
			.expect('Content-Type', /json/)
			.expect('Content-Length',JSON.stringify({id: 'some id'}).length.toString())
			.expect(200, done);
	});
});


describe('GET /sessions/reports/:id', function() {
	function rand(n: number):number {
		return Math.floor(Math.random() * n);
	}	
	it('responds with json', function(done) {
		request(app)
			.get('/sessions/reports/' + rand(1000000).toString())
			.expect('Content-Type', /json/)
			.expect(200, done);
	});
});