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

    await UserCognitoManager.getUserAttributeVerificationCode(
      authorizerContext.token,
      body.attributeName
    );

    callback(null, buildResponse(200, "OK"));
  } catch (error) {
    console.error("get user atribute verification code error, ", error);

    if (error.message) {
      callback(
        null,
        buildResponse(400, {
          code: error.code,
          message: error.message
        })
      );
    }

    callback(null, buildResponse(500, "Internal server error"));
  }
};
