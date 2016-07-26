'use strict'

var cfg      = require('config'),
    chai     = require('chai'),
    sinon    = require('sinon'),
    Reporter = require('../../Reporter.js');

/*
 * Set up chai
 */
chai.should();


var timeout = cfg.test.timeout.unit || (1000*2);

// Some common functions

var stubFn    = function ()        {};



/*
 * The actual tests
 */

describe('The reporter', function () {

  this.timeout(timeout);

  var rp,
      consoleErrStub,
      sendMessageStub
  ;

  before(function (done) {


    var rp = new Reporter ({
      appName: '',
      appSpecificPassword: '',
      clientSecretFile: '',
      googleScopes: '',
      name: '',
      notificationTo: '',
      tokenDir: '',
      tokenFile: '',
      user: ''
    });


    sendMessageStub = sinon.stub(rp,'_mailer');
    consoleErrStub = sinon.stub(rp,'console.err');

    done();

  });


  describe('handleError', function () {


    describe('checking a message has been received', function () {

      it('logs an error if the gmail api fails', function (done) {
        sendMessageStub.yields('Test error');
	rp.handleError({errMsg: 'This is an error email'})
	consoleErrStub.calledWith('Reporter: Error sending email: This is an error email').should.be.true
      });

      it('invokes the gmail api');

    });


  });



  after(function (done) {
    revert();
    done();
  });

});
