const AuthManager = require("/opt/AuthManager");

const { preproccessBody } = require("/opt/request.lib.js");
const { buildResponse } = require("/opt/response.lib.js");

const { validationSchema } = require("./config");

module.exports.handler = async (event, context, callback) => {
  try {
    const body = await preproccessBody(event, callback, validationSchema);

    if (!body) return;

    const { username } = body;

    const res = await AuthManager.forgotPassword(username);

    callback(null, buildResponse(200, res));
  } catch (error) {
    console.error("sign up error", error);

    if (error.message === "oauthUser") {
      callback(
        null,
        buildResponse(400, {
          code: "oauthUser",
          message: `You can't restore password. Please use Social SignIn`
        })
      );

      return;
    }

    if (error.message) {
      callback(
        null,
        buildResponse(400, {
          message: error.message,
          code: error.code
        })
      );

      return;
    }

    callback(
      null,
      buildResponse(500, {
        message: "Internal Server Error"
      })
    );
  }
};
