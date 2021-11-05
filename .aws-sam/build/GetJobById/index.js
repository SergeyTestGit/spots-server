const { NODE_ENV } = process.env;
const _ = require("lodash");

const { getUserFromEvent } = require(NODE_ENV === 'test' ? "../../../LibsLayer/RequestLibLayer/request.lib" : "/opt/request.lib.js");
const { buildResponse } = require(NODE_ENV === 'test' ? "../../../LibsLayer/ResponseLibLayer/response.lib" : "/opt/response.lib.js");

const JobManager = require(NODE_ENV === 'test' ? "../../../ManagersLayer/Managers/JobsManager" : "/opt/JobsManager");

module.exports.handler = async (event, context, callback) => {
  try {
    if (
      !event.pathParameters ||
      !(event.pathParameters && event.pathParameters.id)
    ) {
      return callback(null, buildResponse(400, "Bad Request"));
    }

    const { id } = event.pathParameters;
    let user = null;

    try {
      const [cognitoUser] = await getUserFromEvent(event, {
        forceAuthInvoke: true
      });

      user = cognitoUser;
    } catch (err) {
      console.error(err);
    }

    const queryStringParameters =
      _.get(event, "queryStringParameters", {}) || {};

    const jobData = await JobManager.getFullJobById(
      id,
      user,
      queryStringParameters,
      true
    );

    if (!jobData) {
      return callback(
        null,
        buildResponse(400, {
          message: "Bad Request",
          details: ["Invalid job ID"]
        })
      );
    }

    callback(null, buildResponse(200, jobData));
  } catch (error) {
    console.error("get job error, ", error);

    if (
      error.message === "User is disabled" ||
      error.code === "ExpiredJob" ||
      error.code === "JobAlreadyBooked"
    ) {
      callback(
        null,
        buildResponse(400, {
          code: error.code,
          message: error.message
        })
      );

      return;
    }

    callback(null, buildResponse(500, "Internal server error"));
  }
};
