const AWS = require("aws-sdk");
AWS.config.update({ region: 'us-east-1' });
const awsSecretsManager = new AWS.SecretsManager();

module.exports.awsSecretsManager = awsSecretsManager;
