const JobReviewManager = require("/opt/JobReviewManager");

const { buildResponse } = require("/opt/response.lib.js");

module.exports.handler = async (event, context, callback) => {
  try {
    const { userId } = event.pathParameters || {};

    if (!userId) {
      return callback(null, buildResponse(400, "Bad Request"));
    }

    const userReviews = await JobReviewManager.getFullReviewsForUser(userId);

    callback(null, buildResponse(200, userReviews));
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
