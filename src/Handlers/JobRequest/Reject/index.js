const _ = require("lodash");

const JobRequestsManager = require("/opt/JobRequestManager");

const { getUserFromEvent } = require("/opt/request.lib.js");
const { buildResponse } = require("/opt/response.lib.js");

module.exports.handler = async (event, context, callback) => {
  try {
    const jobRequestId = _.get(event, "pathParameters.jobRequestId", null);

    if (!jobRequestId) {
      callback(null, buildResponse(400, "Bad Request"));

      return;
    }

    const [cognitoUser] = await getUserFromEvent(event);

    if (!cognitoUser) {
      return callback(null, buildResponse(401, "Unathorized"));
    }

    await JobRequestsManager.rejectJobRequest(jobRequestId, event);

    callback(null, buildResponse(200, "OK"));
  } catch (error) {
    console.error("accept application error, ", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
};
