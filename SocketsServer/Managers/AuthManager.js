const _ = require("lodash");

const UserCognitoManager = require("./UserCognitoManager");

class AuthManager {
  async getUserByToken(token) {
    // check token included
    if (!_.isString(token)) {
      return ["Unauthorized"];
    }

    const cognitoUser = await UserCognitoManager.getCognitoUser({
      accessToken: token
    });

    return cognitoUser;
  }
}

module.exports = new AuthManager();
module.exports.AuthManager = AuthManager;
