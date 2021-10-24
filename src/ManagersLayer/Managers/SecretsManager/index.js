const SecretsManager = require("./SecretsManager");
const { awsSecretsManager } = require("./AWSSecretsManager");

module.exports.SecretsManager = SecretsManager;
module.exports.awsSecretsManager = awsSecretsManager;

module.exports = new SecretsManager();
