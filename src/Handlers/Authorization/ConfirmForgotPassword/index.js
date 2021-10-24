const AuthManager = require("/opt/AuthManager");

const { preproccessBody } = require("/opt/request.lib.js");
const { buildResponse } = require("/opt/response.lib.js");

const { validationSchema } = require("./config");

module.exports.handler = async (event, context, callback) => {
  try {
    const body = await preproccessBody(event, callback, validationSchema);

    if (!body) return;

    await AuthManager.confirmForgotPassword(
      body.username,
      body.password,
      body.confirmationCode
    );

    console.log("password changed");

    callback(null, buildResponse(200, "OK"));
  } catch (error) {
    console.error("confirm forgot password error", error);

    console.log(error.message);

    if (error.message) {
      callback(
        null,
        buildResponse(400, {
          code: error.code,
          message: error.message
        })
      );

      return;
    }

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

    callback(
      null,
      buildResponse(500, {
        message: "Internal Server Error"
      })
    );
  }
};
