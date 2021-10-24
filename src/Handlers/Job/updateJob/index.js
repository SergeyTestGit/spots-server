const JobManager = require("/opt/JobsManager");

const { preproccessBody, getUserFromEvent } = require("/opt/request.lib.js");
const { buildResponse } = require("/opt/response.lib.js");

const { validationSchema } = require("./config");

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
      return callback(
        null,
        buildResponse(403, {
          code: "UserIsntAuthor",
          message: "You're not author of the job"
        })
      );
    }

    const update = await preproccessBody(
      event,
      callback,
      validationSchema,
      data => {
        delete data.author;
        delete data._id;

        if (data.doneBefore) data.doneBefore = new Date(data.doneBefore);
        if (data.expiryDate) data.expiryDate = new Date(data.expiryDate);

        return data;
      }
    );

    const updatedJob = await JobManager.updateJob(id, update);

    callback(null, buildResponse(200, updatedJob));
  } catch (error) {
    console.error("update job error, ", error);

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
