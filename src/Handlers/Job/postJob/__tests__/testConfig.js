const mockedJobData = require("../../../../tests/mockData/defaultJob");
const mockedUserData = require("../../../../tests/mockData/defaultUser");

const validJob = {
  ...mockedJobData.job,
  author: mockedUserData.fullCognitoUserStripped.username
};

const invalidJob = {
  ...mockedJobData.job,
  budget: -1
};

const requestData = {
  ...mockedJobData.job
};

delete requestData.author;

module.exports.requestData = requestData;
module.exports.validJob = validJob;
module.exports.invalidJob = invalidJob;
