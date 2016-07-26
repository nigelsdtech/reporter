"use strict"

var GmailModel = require('gmail-model')


// Some object variables
var
    _appName,
    _notificationTo,
    _mailer;

/*
 * Reporter constructor.
 * @param {object}   params - Params to be passed in
 * @param {string}   params.appName - name of the application invoking this reporter
 * @param {string}   params.appSpecificPassword - for gmail
 * @param {string}   params.clientSecretFile - full path to the client secret file to be used by google if an access token doesn't yet exist
 * @param {string[]} params.googleScopes - Google drive scopes for which this object instance will have permissions
 * @param {string}   params.name - Name of the google inbox being used by the reporter
 * @param {string}   params.notificationTo - Name of the recipient
 * @param {string}   params.tokenDir - directory on the local machine in which the google access token lives
 * @param {string}   params.tokenFile - name of file on the local machine that contains the google access token
 * @param {string}   params.user - Gmail username (for sending emails)
 * @constructor
 */
function Reporter(params) {

  /*
   * Set up an emailer
   */

  this._mailer = new GmailModel({
    appSpecificPassword : params.appSpecificPassword,
    clientSecretFile    : params.clientSecretFile,
    emailsFrom          : params.emailsFrom,
    googleScopes        : params.googleScopes,
    name                : params.name,
    tokenDir            : params.tokenFileDir,
    tokenFile           : params.tokenFile.personal,
    user                : params.user
  });


  this._appName        = params.appName,
  this._notificationTo = params.notificationTo
}



var method = Reporter.prototype;

/**
 * HandleError
 *
 * @desc Send out an error notification
 *
 *
 * @alias HandleError
 *
 * @param {object=} params - Parameters for request
 * @param {string}  params.errMsg
 */
method.handleError = function (params) {

  var emailContent = "Error running " + this._appName;
     emailContent += '<p>'+params.errMsg;

  this._mailer.sendMessage({
    body: emailContent,
    subject: this._appName + " ERROR",
    to: this._notificationTo
  }, function(err) {

    if (err) {
      var errMsg = 'Reporter: Error sending email: ' + err;
      console.err(errMsg)
    }
  });


}


/**
 * SendCompletionNotice
 *
 * @desc Send out a message once the script has completed successfully
 *
 * @alias SendCompletionNotice
 *
 * @param {object=} params - Parameters for request
 * @param {string}  params.body - Email body
 */
method.sendCompletionNotice = function (params) {

  var emailContent = this._appName + " complete.\n";
     emailContent += '<p>\n';
     emailContent += params.body;

  this._mailer.sendMessage({
    body: emailContent,
    subject: this._appName + " Report",
    to: this._notificationTo
  }, function(err) {

    if (err) {
      var errMsg = 'Reporter SendCompletionNotice: Error sending email: ' + err;
      console.err(errMsg)
      throw err
    }
  });


}

// export the class
module.exports = Reporter;
