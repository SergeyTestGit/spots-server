const _ = require("lodash");

const FavouriteSPManager = require("/opt/FavouriteSPManager");

const { preproccessBody, getUserFromEvent } = require("/opt/request.lib.js");
const { buildResponse } = require("/opt/response.lib.js");

const { validationSchema } = require("./config");

module.exports.handler = async (event, context, callback) => {
  try {
    const body = await preproccessBody(event, callback, validationSchema);

    if (!body) return;

    const [cognitoUser] = await getUserFromEvent(event);

    if (!cognitoUser) {
      return callback(null, buildResponse(401, "Unathorized"));
    }

    await FavouriteSPManager.deleteFromFavourite(body.favouriteSpId);

    callback(null, buildResponse(200, "OK"));
  } catch (error) {
    console.error("delete sp from favourites error, ", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
};
