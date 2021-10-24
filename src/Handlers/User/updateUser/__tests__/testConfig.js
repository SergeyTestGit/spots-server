const mockedUserData = require("../../../../tests/mockData/defaultUser");

const validBody = {
  accessToken: "token",
  username: "user_id",
  update: {}
};

const invalidBody = {};

const invalidUpdate = {
  firstName: 1,
  certificates: ""
};

module.exports = {
  validBody,
  invalidBody,
  invalidUpdate
};
