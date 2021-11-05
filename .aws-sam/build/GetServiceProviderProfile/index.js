const _ = require("lodash");

const ServiceProvidersManager = require("/opt/ServiceProvidersManager");

const { getUserFromEvent } = require("/opt/request.lib.js");
const { buildResponse } = require("/opt/response.lib.js");

module.exports.handler = async (event, context, callback) => {
  try {
    const [cognitoUser] = await getUserFromEvent(event, {
      forceAuthInvoke: true
    });

    const user = cognitoUser;

    const { id: username } = event.pathParameters;

    const queryStringParameters =
      _.get(event, "queryStringParameters", {}) || {};

    const requestedUser = await ServiceProvidersManager.getSPProfile(
      username,
      user,
      queryStringParameters,
      { appliedJobs: true }
    );

    callback(null, buildResponse(200, requestedUser));
  } catch (error) {
    console.log(error, error.message, error.code);
    if (error.message === "User is disabled") {
      callback(
        null,
        buildResponse(400, {
          code: error.code,
          message: error.message
        })
      );

      return;
    }

    if (error.message === "NotServiceProvider") {
      callback(
        null,
        buildResponse(400, {
          code: "NotServiceProvider",
          message: `User isn't a Service Provider`
        })
      );

      return;
    }

    if (error.code === "NotAuthorizedException") {
      callback(null, buildResponse(401, error.message));
    }

    console.error("get SP profile error, ", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
};
