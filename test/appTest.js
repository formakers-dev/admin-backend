const chai = require('chai');
const should = chai.should();

describe('App', () => {
    it('Hello, Mocha!', function () {
        const a = 'a';

        a.should.be.eql('a');
    });
});
