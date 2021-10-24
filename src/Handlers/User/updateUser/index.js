const { NODE_ENV } = process.env;
const UserManager = require(NODE_ENV === 'test' ? "../../../ManagersLayer/Managers/UserManager" : "/opt/UserManager");

const { preproccessBody, getUserFromEvent } = require(NODE_ENV === 'test' ? "../../../LibsLayer/RequestLibLayer/request.lib" : "/opt/request.lib");
const { buildResponse } = require(NODE_ENV === 'test' ? "../../../LibsLayer/ResponseLibLayer/response.lib" : "/opt/response.lib.js");

const { bodyValidationSchema } = require("./config");

module.exports.handler = async (event, context, callback) => {
  try {
    const update = await preproccessBody(
      event,
      callback,
      bodyValidationSchema,
      data => {
        if (data.birthdate) data.birthdate = new Date(data.birthdate || "");

        return data;
      }
    );

    if (!update) return;

    const [cognitoUser, authorizerContext] = await getUserFromEvent(event);

    if (!cognitoUser) {
      return callback(null, buildResponse(401, "Unathorized"));
    }

    if (!cognitoUser.isAgreedWithTerms && !update.isAgreedWithTerms) {
      callback(
        null,
        buildResponse(400, {
          error: "UserNotAgreedWithTerms",
          message: "Agree with terms to be able to update your profile"
        })
      );

      return;
    }

    const updateResponse = await UserManager.updateUser(
      update,
      cognitoUser.username,
      { accessToken: authorizerContext.token }
    );

    const user = await UserManager.getFullUser(
      { accessToken: authorizerContext.token },
      {
        populate: true,
        dynamoUserAttributes: updateResponse.dynamo,
        forceCongnito: true
      }
    );

    callback(null, buildResponse(200, user));
  } catch (error) {
    // console.error("update user error, ", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
};
