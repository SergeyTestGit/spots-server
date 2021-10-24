const JobManager = require("/opt/JobsManager");

const { getUserFromEvent } = require("/opt/request.lib.js");
const { buildResponse } = require("/opt/response.lib.js");

const jobStatus = require("/opt/nodejs/Constants/jobStatus");

module.exports.handler = async (event, context, callback) => {
  try {
    const [cognitoUser] = await getUserFromEvent(event);

    if (!cognitoUser) {
      return callback(null, buildResponse(401, "Unathorized"));
    }

    const { id } = event.pathParameters || {};

    if (!id) {
      return callback(null, buildResponse(400, "Bad Request"));
    }

    const jobToDelete = await JobManager.getJobById(id);

    if (jobToDelete.author !== cognitoUser.username) {
      callback(
        null,
        buildResponse(403, {
          code: "UserIsntAuthor",
          message: "You're not author of the job"
        })
      );

      return;
    }

    if (jobToDelete.jobStatus === jobStatus.booked) {
      callback(
        null,
        buildResponse(403, {
          code: "BookedJob",
          message: "You can't delete booked job"
        })
      );

      return;
    }

    await JobManager.deleteJob(id);

    callback(null, buildResponse(200, "OK"));
  } catch (error) {
    console.error("delete job error, ", error);

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
