module.exports.handler = async (event, context, callback) => {
  const _ = require("lodash");

  const UserManager = require("/opt/UserManager");

  const { preproccessBody } = require("/opt/request.lib.js");
  const { buildResponse } = require("/opt/response.lib.js");

  const { validationSchema } = require("./config");

  const {
    authProviders,
    getSignInWithErrorMessage
  } = require("/opt/nodejs/Constants/authProviders");

  let body = null;

  try {
    body = await preproccessBody(event, callback, validationSchema);

    if (!body) return;

    const { username, password, email, phoneNumber } = body;

    const userFields = {
      email,
      phoneNumber,
      authProvider: authProviders.cognito,
      isAgreedWithTerms: true
    };

    const [fullNewUser, CodeDeliveryDetails] = await UserManager.createNewUser(
      username,
      password,
      userFields
    );

    callback(
      null,
      buildResponse(200, {
        codeDeliveryDetails: CodeDeliveryDetails,
        user: fullNewUser
      })
    );
  } catch (error) {
    if (
      error.message === "UserExistsException" ||
      error.message === "cognito"
    ) {
      let details = [];

      if (_.isObject(error.existingUser) && _.isObject(body)) {
        const { existingUser } = error;

        console.log(existingUser);

        if (
          _.isString(body.username) &&
          _.isString(existingUser.username) &&
          body.username === existingUser.username
        ) {
          details.push("username");
        }
        if (
          _.isString(body.email) &&
          _.isString(existingUser.email) &&
          body.email === existingUser.email
        ) {
          details.push("email");
        }
        if (
          _.isString(body.phoneNumber) &&
          _.isString(existingUser.phone_number) &&
          body.phoneNumber === existingUser.phone_number
        ) {
          details.push("phone_number");
        }
      }

      callback(
        null,
        buildResponse(400, {
          message: "User already exists",
          code: "UserExistsException",
          details
        })
      );

      return;
    } else if (Object.keys(authProviders).indexOf(error.message) > -1) {
      callback(
        null,
        buildResponse(400, {
          code: "wrongAuthProvider" + _.capitalize(error.message),
          message: getSignInWithErrorMessage(error.message)
        })
      );

      return;
    }
    console.error("sign up error", error);

    callback(
      null,
      buildResponse(400, {
        message: error.message,
        code: error.code
      })
    );
  }
};
