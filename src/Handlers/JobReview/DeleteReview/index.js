const JobReviewManager = require("/opt/JobReviewManager");

const { getUserFromEvent } = require("/opt/request.lib.js");
const { buildResponse } = require("/opt/response.lib.js");

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

    const reviewToUpdate = await JobReviewManager.getReviewById(id);

    console.log("reviewToUpdate", reviewToUpdate);

    if (reviewToUpdate.author !== cognitoUser.username) {
      return callback(
        null,
        buildResponse(403, {
          code: "UserIsntAuthor",
          message: "You're not author of the review"
        })
      );
    }

    await JobReviewManager.deleteReview(id);

    callback(null, buildResponse(200, "OK"));
  } catch (error) {
    console.error("update review error, ", error);

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
