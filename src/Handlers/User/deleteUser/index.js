const UserCognitoManager = require("/opt/UserCognitoManager");
const UserManager = require("/opt/UserManager");
const JobManager = require("/opt/JobsManager");
const ApplyJobManager = require("/opt/ApplyJobManager");
const FavouriteJobManager = require("/opt/FavouriteJobManager");
const FavouriteSPManager = require("/opt/FavouriteSPManager");
const JobRequestsManager = require("/opt/JobRequestManager");
const UserDynamoDBManager = require("/opt/UserDynamoDBManager");

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

    await UserManager.updateUser(
      {
        deletion_reason: body.deletionReason
      },
      cognitoUser.username,
      {
        accessToken: authorizerContext.token
      }
    );

    JobManager.deleteUsersJobs(cognitoUser.username);
    ApplyJobManager.deleteUsersApplications(cognitoUser.username);
    FavouriteSPManager.deleteUsersFavouriteSPs(cognitoUser.username);
    FavouriteJobManager.deleteUsersFavouriteJobs(cognitoUser.username);
    JobRequestsManager.deleteUsersJobRequests(cognitoUser.username);
    UserDynamoDBManager.deleteUser(cognitoUser.username);

    const data = await UserCognitoManager.disableUser(cognitoUser.username);
    await UserCognitoManager.deleteUser(cognitoUser.username);

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
