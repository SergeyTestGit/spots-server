const AWS = require("aws-sdk");

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

module.exports.cognitoIdentityServiceProvider = cognitoIdentityServiceProvider;
