const { buildResponse } = require("/opt/response.lib.js");

module.exports.handler = async (event, context, callback) => {
  try {
    const {
      preproccessBody,
      getUserFromEvent
    } = require("/opt/request.lib.js");

    const PaypalManager = require("/opt/PaypalManager");
    const { validationSchema } = require("./config");

    const [cognitoUser] = await getUserFromEvent(event);

    if (!cognitoUser) {
      return callback(null, buildResponse(401, "Unathorized"));
    }

    const body = await preproccessBody(event, callback, validationSchema);

    if (!body) return;

    const { paymentMethod, amount } = body;
    const userId = cognitoUser.username;

    const { redirect_uri = null } = event.queryStringParameters || {};

    if (paymentMethod === "paypal") {
      await PaypalManager.createPayment(amount, userId, callback, redirect_uri);
    }
  } catch (error) {
    console.log("buy points, ", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
};
