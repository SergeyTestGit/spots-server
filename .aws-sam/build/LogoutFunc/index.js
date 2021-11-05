const _ = require("lodash");

const { buildResponse } = require("/opt/response.lib.js");

module.exports.handler = async (event, context, callback) => {
  try {
    const localAuthorizerInvoke = require("/opt/Helpers/localAuthorizerInvoke");

    const AuthManager = require("/opt/AuthManager");

    try {
      await localAuthorizerInvoke(event);
    } catch (error) {
      return callback(null, buildResponse(400, error));
    }

    const authorizerContext = _.get(event, "requestContext.authorizer", null);

    if (!authorizerContext) {
      return callback(null, buildResponse(401, "Unauthorized"));
    }

    await AuthManager.revokeSession(authorizerContext.token);

    callback(null, buildResponse(200, "OK"));
  } catch (error) {
    console.error("logout error, ", error);
    if (error.code === "NotAuthorizedException") {
      callback(null, buildResponse(401, error.message));
    }

    callback(null, buildResponse(500, "Internal server error"));
  }
};
