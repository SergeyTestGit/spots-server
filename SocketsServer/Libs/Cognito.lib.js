const _ = require("lodash");

const AWS = require("./AWS.lib");

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

cognitoIdentityServiceProvider.listUserPools(
  { MaxResults: 10 },
  (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const UserPoolId = _.get(data, "UserPools[0].Id", null);

    console.log("UserPoolId", UserPoolId);

    module.exports.UserPoolId = UserPoolId;
  }
);

module.exports.cognitoIdentityServiceProvider = cognitoIdentityServiceProvider;
