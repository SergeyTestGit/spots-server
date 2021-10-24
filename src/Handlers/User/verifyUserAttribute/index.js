const UserCognitoManager = require("/opt/UserCognitoManager");

const { preproccessBody, getUserFromEvent } = require("/opt/request.lib.js");
const { buildResponse } = require("/opt/response.lib.js");

const { validationSchema } = require("./config");

module.exports.handler = async (event, context, callback) => {
  try {
    const body = await preproccessBody(event, callback, validationSchema);

    if (!body) return;

    const [cognitoUser, authorizerContext] = await getUserFromEvent(event);

    if (!cognitoUser) {
      return callback(null, buildResponse(401, "Unathorized"));
    }

    const data = await UserCognitoManager.verifyUserAttribute(
      authorizerContext.token,
      body.attributeName,
      body.code
    );

    callback(null, buildResponse(200, data));
  } catch (error) {
    console.error("verify user attribute error, ", error);

    if (error.code) {
      callback(
        null,
        buildResponse(400, {
          message: error.message,
          code: error.code
        })
      );
    }

    callback(null, buildResponse(500, "Internal server error"));
  }
};
