import { expect } from 'chai';
import mocha from 'mocha';

import Csv from './../src/util/csv';

describe('Util Csv', function () {
  describe('Can make empty object', function () {
    const csv = new Csv('');
    it('Empty Headers', function (done) {
      expect(JSON.stringify(csv.headers())).to.be.equal(JSON.stringify([]));
      done();
    });
    it('Empty Rows', function (done) {
      expect(JSON.stringify(csv.rows())).to.be.equal(JSON.stringify([]));
      done();
    });
  });

  describe('Single Column with header', function () {
    const csv = new Csv(
      `myheader
1`
    );
    it('Has a single header', function (done) {
      expect(JSON.stringify(csv.headers())).to.be.not.equal(JSON.stringify([]));
      expect(csv.headers().length).to.be.equal(1);
      expect(csv.headers()[0]).to.be.equal('myheader');
      expect(JSON.stringify(csv.headers()[0])).to.be.not.equal('not_myheader');
      done();
    });
    it('Has a single row', function (done) {
      expect(JSON.stringify(csv.rows())).to.be.not.equal(JSON.stringify([]));
      expect(csv.rows().length).to.be.equal(1);
      expect(JSON.stringify(csv.rows()[0])).to.be.equal(
        JSON.stringify({ myheader: '1' })
      );
      done();
    });
  });
});
