const _ = require("lodash");

const FavouriteSPManager = require("/opt/FavouriteSPManager");
const UserCognitoManager = require("/opt/UserCognitoManager");

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

    const favouriteSp = await UserCognitoManager.getCognitoUser({
      username: body.spId
    });

    if (!favouriteSp.isProvider) {
      callback(
        null,
        buildResponse(400, {
          code: "NotServiceProvider",
          message: `User isn't a Service Provider`
        })
      );

      return;
    }

    const newFavouriteJob = await FavouriteSPManager.addToFavourites(
      cognitoUser.username,
      body.spId
    );

    callback(null, buildResponse(200, newFavouriteJob));
  } catch (error) {
    console.error("add SP to favourites error, ", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
};
