const { NODE_ENV } = process.env;
const UserManager = require(NODE_ENV === 'test' ? "../../../ManagersLayer/Managers/UserManager" : "/opt/UserManager");

const { getUserFromEvent } = require(NODE_ENV === 'test' ? "../../../LibsLayer/RequestLibLayer/request.lib" : "/opt/request.lib.js");
const { buildResponse } = require(NODE_ENV === 'test' ? "../../../LibsLayer/ResponseLibLayer/response.lib" : "/opt/response.lib.js");

module.exports.handler = async (event, context, callback) => {
  try {
    const [cognitoUser, authorizerContext] = await getUserFromEvent(event);

    if (!cognitoUser) {
      return callback(null, buildResponse(401, "Unathorized"));
    }

    const fullUser = await UserManager.getFullUser(
      { accessToken: authorizerContext.token },
      {
        populate: true,
        cognitoUser,
        forceCognito: true
      }
    );

    callback(null, buildResponse(200, fullUser));
  } catch (error) {
    console.error("get full user error, ", error);

    if (error.code === "NotAuthorizedException") {
      callback(null, buildResponse(401, error.message));
    }

    callback(null, buildResponse(500, "Internal server error"));
  }
};
