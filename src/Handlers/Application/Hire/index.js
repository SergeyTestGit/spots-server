const _ = require("lodash");

const JobsManager = require("/opt/JobsManager");
const ApplyJobManager = require("/opt/ApplyJobManager");

const { preproccessBody, getUserFromEvent } = require("/opt/request.lib.js");
const { buildResponse } = require("/opt/response.lib.js");

const { validationSchema } = require("./config");

module.exports.handler = async (event, context, callback) => {
  try {
    // callback(null, buildResponse(401, {}));

    const body = await preproccessBody(
      event,
      callback,
      validationSchema,
      data => {
        if (data.startDate) data.startDate = new Date(data.startDate || "");

        return data;
      }
    );

    if (!body) return;

    const [cognitoUser] = await getUserFromEvent(event);

    if (!cognitoUser) {
      return callback(null, buildResponse(401, "Unathorized"));
    }

    const { jobId, userId: applicantId, startDate, budget, currency } = body;

    // if (await ApplyJobManager.checkUserAppliedForJob(applicantId, jobId)) {
    await JobsManager.hireUserForJob(
      jobId,
      applicantId,
      startDate,
      budget,
      currency,
      event
    );
    // } else {
    //   console.log(`send hire request to ${applicantId}`);
    //   // send hire request
    // }

    callback(null, buildResponse(200, "OK"));
  } catch (error) {
    console.error("hire applicant error, ", error);

    if (error.code === "JobAlreadyBooked") {
      callback(null, buildResponse(400, error));

      return;
    }

    callback(null, buildResponse(500, "Internal server error"));
  }
};
