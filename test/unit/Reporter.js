'use strict'

var cfg        = require('config'),
    chai       = require('chai'),
    GmailModel = require('gmail-model'),
    sinon      = require('sinon'),
    reporter   = require('../../Reporter.js');

/*
 * Set up chai
 */
chai.should();


var timeout = cfg.test.timeout.unit || (1000*2);
var appName = cfg.appName;



/*
 * The actual tests
 */

describe('The reporter', function () {

  this.timeout(timeout);

  var consoleErrorStub,
      sendMessageStub;


  before(function () {

    sendMessageStub = sinon.stub(GmailModel.prototype,'sendMessage');
    consoleErrorStub = sinon.stub(console,'error');

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


  });


  describe('handleError', function () {

    it('prepares the right error message', function () {

      var errMsg = 'Some generic message'
      sendMessageStub.yields(null);

      reporter.handleError({errMsg: errMsg })

      var intendedBody = "Error running " + appName;
          intendedBody += '<p>'+errMsg;

      sendMessageStub.calledWith({
        body: intendedBody,
        subject: appName + " ERROR",
        to: ''
      }).should.be.true


    });

    it('logs and throws an error if the gmail api fails', function () {
      sendMessageStub.yields('Err123');
      try { reporter.handleError({errMsg: 'Email body'}) }
      catch (e) {
	consoleErrorStub.calledWith('Reporter: Error sending email: Error running ' + appName + '<p>Email body').should.be.true
        sendMessageStub.threw().should.be.true
      }
    });

  });



  describe('sendCompletionNotice', function () {

    it('prepares the right email', function () {

      var report = "Generic test complete"
      sendMessageStub.yields(null);

      reporter.sendCompletionNotice({body: report })

      var intendedBody = appName + " complete.\n";
          intendedBody += '<p>\n';
          intendedBody += report;

      sendMessageStub.calledWith({
        body: intendedBody,
        subject: appName + " Report",
        to: ''
      }).should.be.true

    });


    it('logs and throws an error if the gmail api fails', function () {
      sendMessageStub.yields('Err123');
      try { reporter.sendCompletionNotice({body: 'Email body'}) }
      catch (e) {
	consoleErrorStub.calledWith('Reporter: Error sending email: Error running ' + appName + '<p>Email body').should.be.true
        sendMessageStub.threw().should.be.true
      }
    });

  });

  after(function () {
    sendMessageStub.restore();
    consoleErrorStub.restore();
  });

});
