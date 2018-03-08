'use strict'

var chai       = require('chai'),
    GmailModel = require('gmail-model'),
    sinon      = require('sinon'),
    reporter   = require('../../Reporter.js');

/*
 * Set up chai
 */
chai.should();


var timeout = (1000*2);
var appName = 'MyTestApp';



/*
 * The actual tests
 */

describe('The reporter', function () {

  this.timeout(timeout);

  var sendMessageStub  = sinon.stub(GmailModel.prototype,'sendMessage');;
  var consoleErrorStub = sinon.stub(console,'error');

  reporter.configure ({
    appName: appName,
    appSpecificPassword: '',
    clientSecretFile: '',
    gmailModel: GmailModel,
    googleScopes: '',
    name: '',
    notificationTo: '',
    tokenDir: '',
    tokenFile: '',
    user: ''
  });


  var sgm = 'Some generic message'

  var tests = [{
    fnName: 'handleError',
    fn: reporter.handleError,
    fnArgs: { errMsg: sgm },
    expectedEmailSubject: appName + ' ERROR',
    expectedEmailBody: 'Error running ' + appName + '<p>' + sgm }, {

    fnName: 'sendCompletionNotice',
    fn: reporter.sendCompletionNotice,
    fnArgs: { body: sgm },
    expectedEmailSubject: appName + ' Report',
    expectedEmailBody: appName + ' complete.\n<p>\n' + sgm }]



  /*
   * Utility func to check sendMessageStub is called correctly
   */
  function isSmsCalled(b,s) {
    sendMessageStub.calledWith({
      body: b,
      subject: s,
      to: ''
    }).should.be.true
  }

  beforeEach (function () {
    sendMessageStub.reset()
    consoleErrorStub.reset()
  })


  tests.forEach( function (test) {

    describe(test.fnName + ' without a callback passed in', function () {

      it('prepares and mails out the right message', function () {
        sendMessageStub.yields(null);
        test.fn(test.fnArgs)
        isSmsCalled(test.expectedEmailBody, test.expectedEmailSubject)
      });

      it('runs the callback with an error if the gmail api fails', function () {
        sendMessageStub.yields('Err123');
        test.fn(test.fnArgs)
        isSmsCalled(test.expectedEmailBody, test.expectedEmailSubject)
        consoleErrorStub.calledWith('Reporter error: Err123').should.be.true
      });

    });


    describe(test.fnName + ' with a callback passed in', function () {

      it('prepares and mails out the right message', function () {
        sendMessageStub.yields(null);
        test.fn(test.fnArgs, function (e) {
          chai.expect(e).to.not.exist
          isSmsCalled(test.expectedEmailBody, test.expectedEmailSubject)
        })
      });

      it('runs the callback with an error if the gmail api fails', function () {
        sendMessageStub.yields('Err123');
        test.fn(test.fnArgs, function (e) {
          e.should.equal('Err123')
          isSmsCalled(test.expectedEmailBody, test.expectedEmailSubject)
        })
      });

    });
  })


  after(function () {
    sendMessageStub.restore();
    consoleErrorStub.restore();
  });

});
