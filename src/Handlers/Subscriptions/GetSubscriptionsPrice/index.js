module.exports.handler = async (event, context, callback) => {
  const { buildResponse } = require("/opt/response.lib.js");

  try {
    const _ = require("lodash");
    const SubscriptionsManager = require("/opt/SubscriptionsManager");

    const subscriptionPrices = await SubscriptionsManager.getSubscriptionsCost();

    callback(null, buildResponse(200, subscriptionPrices));
  } catch (error) {
    console.error("GET SUBSCRIPTION PRICE ERROR", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
};
