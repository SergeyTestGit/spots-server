const { getUserFromEvent } = require("/opt/request.lib.js");
const { buildResponse } = require("/opt/response.lib.js");

module.exports.handler = async (event, context, callback) => {
  try {
    const SubscriptionsManager = require("/opt/SubscriptionsManager");

    const [cognitoUser] = await getUserFromEvent(event);

    if (!cognitoUser) {
      return callback(null, buildResponse(401, "Unathorized"));
    }

    const userId = cognitoUser.username;

    await SubscriptionsManager.revertSubscription(userId);

    callback(null, buildResponse(200));
  } catch (error) {
    console.error("revert subscription error, ", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
};
