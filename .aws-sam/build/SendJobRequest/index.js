const JobRequestsManager = require("/opt/JobRequestManager");

const { preproccessBody, getUserFromEvent } = require("/opt/request.lib.js");
const { buildResponse } = require("/opt/response.lib.js");

const { validationSchema } = require("./config");

module.exports.handler = async (event, context, callback) => {
  try {
    const body = await preproccessBody(
      event,
      callback,
      validationSchema,
      data => {
        if (data.suggestedStartDate) {
          data.suggestedStartDate = new Date(data.suggestedStartDate);
        }

        return data;
      }
    );

    if (!body) return;

    const [cognitoUser] = await getUserFromEvent(event);

    if (!cognitoUser) {
      return callback(null, buildResponse(401, "Unathorized"));
    }

    const jobRequest = {
      job: body.jobId,
      employer: cognitoUser.username,
      doer: body.userId
    };

    const newJobRequest = await JobRequestsManager.sendJobRequest(
      jobRequest,
      event,
      cognitoUser
    );

    callback(null, buildResponse(200, newJobRequest));
  } catch (error) {
    console.error("send job request error, ", error);

    if (
      error.code === "UserAlreadyApplied" ||
      error.code === "JobRequestCountOverflow"
    ) {
      callback(null, buildResponse(400, error));

      return;
    }

    callback(null, buildResponse(500, "Internal server error"));
  }
};
