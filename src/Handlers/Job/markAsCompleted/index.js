const _ = require("lodash");

const JobsManager = require("/opt/JobsManager");

const { getUserFromEvent } = require("/opt/request.lib.js");
const { buildResponse } = require("/opt/response.lib.js");

module.exports.handler = async (event, context, callback) => {
  try {
    const jobId = _.get(event, "pathParameters.jobId", null);

    if (!jobId) {
      callback(null, buildResponse(400, "Bad Request"));

      return;
    }

    const [cognitoUser] = await getUserFromEvent(event);

    if (!cognitoUser) {
      return callback(null, buildResponse(401, "Unathorized"));
    }

    const nextJob = await JobsManager.markAsCompleted(
      jobId,
      cognitoUser.username,
      event
    );

    callback(null, buildResponse(200, nextJob));
  } catch (error) {
    console.error("accept application error, ", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
};
