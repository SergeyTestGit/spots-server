module.exports.handler = async (event, context, callback) => {
  const { buildResponse } = require("/opt/response.lib.js");

  try {
    const _ = require("lodash");
    const PricePtsManager = require("/opt/PtsPriceManager");

    const ptsPricesByRegions = await PricePtsManager.getAllPtsPrices();

    const regionPrice = _.find(
      ptsPricesByRegions,
      regionPrice => regionPrice.region === "all"
    );

    if (!regionPrice) {
      callback(null, buildResponse(400, "Invalid Region"));

      return;
    }

    callback(null, buildResponse(200, regionPrice));
  } catch (error) {
    console.error("GET POINTS PRICE ERROR", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
};
