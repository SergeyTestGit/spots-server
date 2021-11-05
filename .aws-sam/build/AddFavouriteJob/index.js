const _ = require("lodash");

const FavouriteJobManager = require("/opt/FavouriteJobManager");

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

    const newFavouriteJob = await FavouriteJobManager.addToFavourites(
      cognitoUser.username,
      body.jobId
    );

    callback(null, buildResponse(200, newFavouriteJob));
  } catch (error) {
    if (error.name.contains("Validation")) {
      callback(
        null,
        buildResponse(400, {
          message: "Bad Request",
          details: error.message
        })
      );

      return;
    }

    console.error("add job to favourites error, ", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
};
