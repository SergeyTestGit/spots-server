const authProviders = require("/opt/nodejs/Constants/authProviders");

module.exports.handler = (event, context, callback) => {
  console.log(event);
  const userAttribs = event.request.userAttributes;

  if (
    userAttribs.hasOwnProperty("custom:authProvider") &&
    userAttribs["custom:authProvider"] !== authProviders.authProviders.cognito
  ) {
    event.response.autoConfirmUser = true;
    event.response.autoVerifyEmail = true;
  }

  console.log(event);
  callback(null, event);
};
