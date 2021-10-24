const { preproccessBody, getUserFromEvent } = require("/opt/request.lib.js");
const { buildResponse } = require("/opt/response.lib.js");

const { validationSchema } = require("./config");

module.exports.handler = async (event, context, callback) => {
  try {
    const _ = require("lodash");

    const SubscriptionsManager = require("/opt/SubscriptionsManager");

    const [cognitoUser] = await getUserFromEvent(event);

    if (!cognitoUser) {
      return callback(null, buildResponse(401, "Unathorized"));
    }

    const body = await preproccessBody(event, callback, validationSchema);

    if (!body) return;

    const { paymentMethod, subscriptionType } = body;
    const userId = cognitoUser.username;

    await SubscriptionsManager.subscribe(
      subscriptionType,
      userId,
      paymentMethod
    );

    callback(null, buildResponse(200));
  } catch (error) {
    console.error("create subscription a job error, ", error);
    if (error.code === "NotEnoughPts") {
      callback(null, buildResponse(400, error));
    }

    callback(null, buildResponse(500, "Internal server error"));
  }
};
