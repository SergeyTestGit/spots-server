const _ = require("lodash");

const JobsManager = require("/opt/JobsManager");

const { preproccessBody, getUserFromEvent } = require("/opt/request.lib.js");
const { buildResponse } = require("/opt/response.lib.js");

const { validationSchema } = require("./config");

module.exports.handler = async (event, context, callback) => {
  try {
    const jobId = _.get(event, "pathParameters.jobId", null);

    console.log(jobId);

    if (!jobId) {
      return callback(null, buildResponse(400, "Bad Request"));
    }

    const body = await preproccessBody(event, callback, validationSchema);

    if (!body) return;

    const [cognitoUser] = await getUserFromEvent(event);

    if (!cognitoUser) {
      return callback(null, buildResponse(401, "Unathorized"));
    }

    console.log(body);

    const nextJob = await JobsManager.canceleJob(jobId, body.reason, cognitoUser, event);

    callback(null, buildResponse(200, nextJob));
  } catch (error) {
    console.error("apply job error, ", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
};
