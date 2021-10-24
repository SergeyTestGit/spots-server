const dynamoose = require("dynamoose");

const AWS = require("./AWS.lib");

const dynamoDB = new AWS.DynamoDB();

dynamoose.setDDB(dynamoDB);

module.exports = dynamoose;
