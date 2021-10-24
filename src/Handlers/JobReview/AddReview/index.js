const _ = require("lodash");

const JobReviewManager = require("/opt/JobReviewManager");

const { preproccessBody, getUserFromEvent } = require("/opt/request.lib.js");
const { buildResponse } = require("/opt/response.lib.js");

const { validationSchema } = require("./config");

module.exports.handler = async (event, context, callback) => {
  try {
    const [cognitoUser] = await getUserFromEvent(event);

    if (!cognitoUser) {
      return callback(null, buildResponse(401, "Unathorized"));
    }

    const newReviewData = await preproccessBody(
      event,
      callback,
      validationSchema
    );

    if (!newReviewData) return;

    newReviewData.author = cognitoUser.username;

    const newReview = await JobReviewManager.createReview(newReviewData);

    callback(null, buildResponse(200, newReview));
  } catch (error) {
    if (error.name.contains("Validation")) {
      callback(
        null,
        buildResponse(400, {
          message: "Bad Request",
          details: error.message
        })
      );

      return;
    }

    console.error("post a job error, ", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
};
