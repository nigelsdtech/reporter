var cfg   = require('config');
var defer = require('config/defer').deferConfig;

module.exports = {

  mailbox: {
    personal: {
      emailAddress: process.env.PERSONAL_EMAIL_ADDRESS,
    },
    work: {
      emailAddress: process.env.OB_EMAIL_ADDRESS,
    }
  },
}
