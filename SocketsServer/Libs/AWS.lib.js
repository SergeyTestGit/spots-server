const path = require("path");

const AWS = require("aws-sdk");

const configPath = path.join(__dirname, "../aws.json");

AWS.config.loadFromPath(configPath);

module.exports = AWS;
