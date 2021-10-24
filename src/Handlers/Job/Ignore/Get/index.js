const _ = require("lodash");

const JobsIgnoreManager = require("/opt/JobsIgnoreManager");

const { getUserFromEvent } = require("/opt/request.lib.js");
const { buildResponse } = require("/opt/response.lib.js");

module.exports.handler = async (event, context, callback) => {
  try {
    const [cognitoUser] = await getUserFromEvent(event);

    if (!cognitoUser) {
      return callback(null, buildResponse(401, "Unathorized"));
    }

    const ignoredJobsList = await JobsIgnoreManager.getUsersIgnoredJobs(
      cognitoUser.username
    );

    callback(null, buildResponse(200, ignoredJobsList));
  } catch (error) {
    console.error("get ignored jobs list error, ", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
};
