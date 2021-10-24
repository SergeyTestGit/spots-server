const nodemailer = require("nodemailer");

let aws = require("./AWS.lib");

const SES = new aws.SES({
  apiVersion: "2010-12-01"
});

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  SES
});

module.exports = { transporter, SES };
