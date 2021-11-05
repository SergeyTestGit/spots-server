const _ = require("lodash");

const JobsIgnoreManager = require("/opt/JobsIgnoreManager");

const { preproccessBody, getUserFromEvent } = require("/opt/request.lib.js");
const { buildResponse } = require("/opt/response.lib.js");

const { validationSchema } = require("./config");

module.exports.handler = async (event, context, callback) => {
  try {
    const body = await preproccessBody(event, callback, validationSchema);

    if (!body) return;

    const [cognitoUser] = await getUserFromEvent(event);

    if (!cognitoUser) {
      return callback(null, buildResponse(401, "Unathorized"));
    }

    const ignoredJobData = {
      jobId: body.jobId,
      userId: cognitoUser.username
    };

    const newJobIgnore = await JobsIgnoreManager.addNewJobIgnore(
      ignoredJobData
    );

    callback(null, buildResponse(200, newJobIgnore));
  } catch (error) {
    console.error("add job to ignore error, ", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
};
