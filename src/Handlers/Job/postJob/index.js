module.exports.handler = async (event, context, callback) => {
  const _ = require("lodash");

  const JobManager = require("/opt/JobsManager");

  const checkProfileComplete = require("/opt/Helpers/checkUserPrfoileComplete");

  const { preproccessBody, getUserFromEvent } = require("/opt/request.lib.js");
  const { buildResponse } = require("/opt/response.lib.js");

  const { validationSchema } = require("./config");

  try {
    const [cognitoUser] = await getUserFromEvent(event);

    if (!cognitoUser) {
      return callback(null, buildResponse(401, "Unathorized"));
    }

    checkProfileComplete(cognitoUser);

    const newJobData = await preproccessBody(
      event,
      callback,
      validationSchema,
      data => {
        if (data.doneBefore) data.doneBefore = new Date(data.doneBefore || "");
        if (data.expiryDate) data.expiryDate = new Date(data.expiryDate || "");

        return data;
      }
    );

    if (!newJobData) return;

    newJobData.author = cognitoUser.username;

    const newJob = await JobManager.createJob(newJobData, event);

    callback(null, buildResponse(200, newJob));
  } catch (error) {
    if (_.isFunction(error.name) && error.name.contains("Validation")) {
      callback(
        null,
        buildResponse(400, {
          message: "Bad Request",
          details: error.message
        })
      );

      return;
    } else if (error.code && error.message) {
      callback(
        null,
        buildResponse(400, {
          code: error.code,
          message: error.message,
          details: error.details
        })
      );
    }

    console.error("post a job error, ", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
};
