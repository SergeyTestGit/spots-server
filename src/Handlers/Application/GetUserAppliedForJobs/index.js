const _ = require("lodash");

// libs
const { getUserFromEvent } = require("/opt/request.lib.js");
const { buildResponse } = require("/opt/response.lib.js");

// managers
const UserCognitoManager = require("/opt/UserCognitoManager");
const ApplyJobManager = require("/opt/ApplyJobManager");
const JobsManager = require("/opt/JobsManager");

// helpers
const FilterQueue = require("/opt/Helpers/Filters/JobFilterQueue");
const getPageList = require("/opt/Helpers/getPageList");
const orderJobs = require("/opt/Helpers/orderJobs");

const { defaultParams, validationSchema } = require("./config");

module.exports.handler = async (event, context, callback) => {
  try {
    const queryStringParameters = _.get(event, "queryStringParameters", {});
    const params = _.defaults(queryStringParameters, defaultParams);

    console.log("params", params);

    try {
      if (params.categories) {
        params.categories = JSON.parse(params.categories);
      }

      if (params.radius) {
        params.radius = parseInt(params.radius);
      }

      if (_.isString(params.elements_per_page)) {
        params.elements_per_page = parseInt(params.elements_per_page);
      }

      if (_.isString(params.page_number)) {
        params.page_number = parseInt(params.page_number);
      }
    } catch (err) {
      console.error(err);

      callback(
        null,
        buildResponse(400, {
          message: "Bad Request",
          details: error.errors
        })
      );

      return;
    }

    try {
      await validationSchema.validate(params, {
        strict: true,
        abortEarly: false
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        callback(
          null,
          buildResponse(400, {
            message: "Bad Request",
            details: error.errors
          })
        );

        return;
      }

      console.error("validation err", error);

      return;
    }

    const [cognitoUser] = await getUserFromEvent(event, {
      forceAuthInvoke: true
    });

    const filter = new FilterQueue(params, cognitoUser);

    const processedList = await JobsManager.getFilteredJobList(
      filter,
      cognitoUser,
      ApplyJobManager.getUsersApplicationsWithJobs
    );

    let orderedList = orderJobs(processedList, params.order_by, params.order);

    const { page_number, elements_per_page } = params;

    const pageListData = getPageList(
      orderedList,
      page_number,
      elements_per_page
    );

    callback(null, buildResponse(200, pageListData));
  } catch (error) {
    console.error("get jobs error", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
};
