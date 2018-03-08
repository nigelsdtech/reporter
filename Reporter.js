"use strict"

//var GmailModel = require('gmail-model')


// Some object variables
var
    _appName,
    _notificationTo,
    _mailer,
    GmailModel
;

/*
 * Reporter constructor.
 * @param {object}   params - Params to be passed in
 * @param {string}   params.appName - name of the application invoking this reporter
 * @param {string}   params.appSpecificPassword - for gmail
 * @param {string}   params.clientSecretFile - full path to the client secret file to be used by google if an access token doesn't yet exist
 * @param {object}   params.gmailModel - Optional. A GmailModel class (not an instance).
 * @param {string[]} params.googleScopes - Google drive scopes for which this object instance will have permissions
 * @param {string}   params.name - Name of the google inbox being used by the reporter
 * @param {string}   params.notificationTo - Name of the recipient
 * @param {string}   params.tokenDir - directory on the local machine in which the google access token lives
 * @param {string}   params.tokenFile - name of file on the local machine that contains the google access token
 * @param {string}   params.user - Gmail username (for sending emails)
 * @constructor
 */
function Configure(params) {

  /*
   * Set up an emailer
   */

  if (params.gmailModel) {GmailModel = params.gmailModel} else {GmailModel = require('gmail-model')}

  _mailer = new GmailModel({
    appSpecificPassword : params.appSpecificPassword,
    clientSecretFile    : params.clientSecretFile,
    emailsFrom          : params.emailsFrom,
    googleScopes        : params.googleScopes,
    name                : params.name,
    tokenDir            : params.tokenFileDir,
    tokenFile           : params.tokenFile.personal,
    user                : params.user
  });


  _appName        = params.appName,
  _notificationTo = params.notificationTo

}

/**
 * stubCb
 *
 * @desc A basic stub function that logs an error to console
 *
 * @param err
 */
function stubCb (err) {
    console.error('Reporter error: ' + err)
}

/**
 * HandleError
 *
 * @desc Send out an error notification
 *
 *
 * @alias HandleError
 *
 * @param {object=} params        - Parameters for request
 * @param {string}  params.errMsg - Error message to be sent in the email
 * @param {cb}      cb            - callback returns cb(err)
 */
function HandleError (params,cb) {

  if (!cb) { cb = stubCb }

  var emailContent = "Error running " + _appName;
     emailContent += '<p>'+params.errMsg;

  _sendMail({
    body: emailContent,
    subject: _appName + " ERROR"
  }, cb);

}


/**
 * SendCompletionNotice
 *
 * @desc Send out a message once the script has completed successfully
 *
 * @alias SendCompletionNotice
 *
 * @param {object=} params      - Parameters for request
 * @param {string}  params.body - Email body
 * @param {cb}      cb          - callback returns cb(err)
 */
function SendCompletionNotice (params,cb) {

  if (!cb) { cb = stubCb }

  var emailContent = _appName + " complete.\n";
     emailContent += '<p>\n';
     emailContent += params.body;

  _sendMail({
    body: emailContent,
    subject: _appName + " Report"
  }, cb);


}

/**
 * _sendMail
 *
 * @desc Actually send the email
 *
 * @alias _sendMail
 *
 * @param {object=} params         - Parameters for request
 * @param {string}  params.body    - Email body
 * @param {string}  params.subject - Email subject
 * @param {cb}      cb             - callback returns cb(err)
 */
function _sendMail (params, cb) {

  _mailer.sendMessage({
    body: params.body,
    subject: params.subject,
    to: _notificationTo
  }, cb)

}


// export the class
module.exports = {
  handleError: HandleError,
  configure: Configure,
  sendCompletionNotice: SendCompletionNotice
}
