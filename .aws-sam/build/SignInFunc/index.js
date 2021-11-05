module.exports.handler = async (event, context, callback) => {
  try {
    const _ = require("lodash");

    const AuthManager = require("/opt/AuthManager");
    const UserManager = require("/opt/UserManager");
    const UserCognitoManager = require("/opt/UserCognitoManager");

    const { preproccessBody } = require("/opt/request.lib.js");
    const { buildResponse } = require("/opt/response.lib.js");

    const { validationSchema } = require("./config");

    const {
      authProviders,
      getSignInWithErrorMessage
    } = require("/opt/nodejs/Constants/authProviders");

    const { isEmail, isPhoneNumber } = require("/opt/Helpers/validation");

    let login = "";

    try {
      const body = await preproccessBody(event, callback, validationSchema);

      if (!body) return;

      const { username, password } = body;
      login = username;

      const tokens = await AuthManager.signIn(username, password);
      const user = await UserManager.getFullUser(
        {
          accessToken: tokens.AccessToken
        },
        { populate: true, forceCongnito: true }
      );

      if (user.authProvider !== authProviders.cognito) {
        callback(
          null,
          buildResponse(400, {
            code: "wrongAuthProvider" + _.capitalize(user.authProvider),
            message: getSignInWithErrorMessage(
              user.authProvider,
              "Invalid Auth Flow"
            )
          })
        );

        return;
      }

      callback(null, buildResponse(200, { user, tokens }));
    } catch (error) {
      if (
        error.code === "NotAuthorizedException" ||
        error.code === "UserNotFoundException"
      ) {
        if (error.message === "User is disabled") {
          callback(
            null,
            buildResponse(400, {
              code: "UserIsDisabled",
              message: error.message
            })
          );

          return;
        }

        const [
          isExists,
          userList
        ] = await UserCognitoManager.checkCognitoUserExists({
          username: login,
          email: login,
          phoneNumber: login
        });

        if (isExists) {
          const user = userList[0];

          if (user.authProvider !== authProviders.cognito) {
            callback(
              null,
              buildResponse(400, {
                code: "wrongAuthProvider" + _.capitalize(user.authProvider),
                message: getSignInWithErrorMessage(
                  user.authProvider,
                  "Invalid Auth Flow"
                )
              })
            );

            return;
          } else {
            let attribName = null;

            if (isEmail(login) && user.email_verified === "false") {
              attribName = "email";
            } else if (
              isPhoneNumber(login) &&
              user.phone_number_verified === "false"
            ) {
              attribName = "phone number";
            }

            let response = {
              code: `NotAuthorizedException`,
              message: `Not verified ${attribName}. Try to log in using your username`
            };

            if (!attribName) {
              response = {
                code: `WrongPassword`,
                message: `Wrong Password`
              };
            }

            callback(null, buildResponse(400, response));

            return;
          }
        }
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
  } catch (error) {}
};
