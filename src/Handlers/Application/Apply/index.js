const _ = require("lodash");

const ApplyJobManager = require("/opt/ApplyJobManager");

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

    const application = {
      jobId: body.jobId,
      userId: cognitoUser.username
    };

    const newApplication = await ApplyJobManager.applyForJob(
      application,
      event
    );

    callback(null, buildResponse(200, newApplication));
  } catch (error) {
    console.error("apply job error, ", error);

    if (error.code === "UserAlreadyHasJobRequest") {
      callback(null, buildResponse(400, error));

      return;
    }

    if (error.code === "UserAlreadyApplied") {
      callback(null, buildResponse(400, error));

      return;
    }

    callback(null, buildResponse(500, "Internal server error"));
  }
};
