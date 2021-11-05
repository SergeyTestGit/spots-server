const _ = require("lodash");

const AuthManager = require("/opt/AuthManager");

const { buildResponse } = require("/opt/response.lib.js");

module.exports.handler = async (event, context, callback) => {
  try {
    const tokenHeader = _.get(event, "headers.Authorization", "");

    const tokenHeaderParts = tokenHeader.split(/ /);

    // check token structure
    if (tokenHeaderParts.length !== 2 || tokenHeaderParts[0] !== "Bearer") {
      return callback(
        null,
        buildResponse(401, {
          message: "Unauthorized"
        })
      );
    }

    const refreshToken = tokenHeaderParts[1];

    const nextCreds = await AuthManager.updateAccessToken(refreshToken);

    callback(null, buildResponse(200, nextCreds.AuthenticationResult));
  } catch (error) {
    switch (error.code) {
      case "UserNotFoundException":
        callback(
          null,
          buildResponse(400, {
            message: error.message,
            code: error.code
          })
        );
        return;

      case "NotAuthorizedException":
        callback(
          null,
          buildResponse(401, {
            message: error.message,
            code: error.code
          })
        );
        return;

      default:
        console.error("update token error", error);

        callback(
          null,
          buildResponse(500, {
            message: "Internal Server Error"
          })
        );

        return;
    }
  }
};
