const mockedUserData = require("../../tests/mockData/defaultUser");

module.exports.cognitoIdentityServiceProvider = {
  updateUserAttributes: (params, callback) => {
    callback(null, params);
  },
  getUser: (params, callback) => {
    callback(null, mockedUserData.cognitoUser);
  }
};
