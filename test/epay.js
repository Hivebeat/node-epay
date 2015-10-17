import chai from 'chai';
import mocha from 'mocha';
import soap from 'soap';
import sinon from 'sinon';
import Epay from '../lib/epay';
var expect = chai.expect;

describe('ePay', () => {
  let createClientStub;

  beforeEach(() => {
    createClientStub = sinon.stub(soap, 'createClient');
  });

  afterEach(() => {
    createClientStub.restore();
  });

  describe('Init', () => {
    it('Should throw for invalid contructor arguments', () => {
      const constructorTest1 = () => new Epay();
      const constructorTest2 = () => new Epay({foo: 'bar'});
      expect(constructorTest1).to.throw(TypeError, 'Cannot read property \'merchantnumber\' of undefined');
      expect(constructorTest2).to.throw(Error, 'Please provide a merchantnumber');
    });

    it('Should set merchantnumber', () => {
      const epay = new Epay({merchantnumber: 42});
      expect(epay.merchantnumber).to.equal(42);
    });
  });

  describe('Get client', () => {
    it('Should return an error when soap returns error', (done) => {
      createClientStub.yields(new Error('This is an error'));
      const epay = new Epay({merchantnumber: 41});
      epay.getClient()
      .then(
        res => {throw new Error('Should not resolve');},
        err => {
          expect(err).to.deep.equal(new Error('This is an error'));
          done();
        }
      );
    });

    it('Should return a client when soap create client is successfull', (done) => {
      createClientStub.yields(null, {foo: 'bar'});
      const epay = new Epay({merchantnumber: 41});
      epay.getClient()
      .then(
        res => {
          expect(res).to.deep.equal({foo: 'bar'});
          done();
        },
        err => {throw err;}
      );
    });
  });

  describe('Call', () => {
    it('Should return error if client does not have function', (done) => {
      createClientStub.yields(null, {foo: 'bar'});
      const epay = new Epay({merchantnumber: 41});
      epay.call('baz')
        .then(
          res => {throw new Error('Should not resolve');},
          err => {
            expect(err).to.deep.equal(new Error('Function baz does not exist!'));
            done();
          }
        );
    });

    it('Should call client func if it exists', (done) => {
      const clientFn = sinon.stub();
      clientFn.yields(null, null);
      createClientStub.yields(null, {
        foo: clientFn
      });
      const epay = new Epay({merchantnumber: 41});
      epay.call('foo')
      .then(
        () => {
          expect(clientFn.called).to.equal(true);
          done();
        }
      );
    });
  });
});
