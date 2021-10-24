const _ = require("lodash");

const JobsIgnoreManager = require("/opt/JobsIgnoreManager");

const { getUserFromEvent } = require("/opt/request.lib.js");
const { buildResponse } = require("/opt/response.lib.js");

module.exports.handler = async (event, context, callback) => {
  try {
    console.log(event.pathParameters);
    const jobIgnoreId = _.get(event, "pathParameters.jobIgnoreId", null);

    if (!jobIgnoreId) {
      callback(null, buildResponse(400, "Bad Request"));

      return;
    }

    const [cognitoUser] = await getUserFromEvent(event);

    console.log(cognitoUser);

    if (!cognitoUser) {
      callback(null, buildResponse(401, "Unathorized"));

      return;
    }

    await JobsIgnoreManager.removeJobIgnore(jobIgnoreId, cognitoUser.username);

    callback(null, buildResponse(200, "OK"));
  } catch (error) {
    console.log("delete job from ignore error, ", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
  console.log("exit");
};
