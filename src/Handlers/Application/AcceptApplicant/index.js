const _ = require("lodash");

const ApplyJobManager = require("/opt/ApplyJobManager");

const { getUserFromEvent } = require("/opt/request.lib.js");
const { buildResponse } = require("/opt/response.lib.js");

module.exports.handler = async (event, context, callback) => {
  try {
    const applicationId = _.get(event, "pathParameters.applicationId", null);

    if (!applicationId) {
      callback(null, buildResponse(400, "Bad Request"));

      return;
    }

    const [cognitoUser] = await getUserFromEvent(event);

    if (!cognitoUser) {
      return callback(null, buildResponse(401, "Unathorized"));
    }

    const updatedApplication = await ApplyJobManager.acceptApplication(
      applicationId,
      event
    );

    callback(null, buildResponse(200, updatedApplication));
  } catch (error) {
    console.error("accept application error, ", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
};
