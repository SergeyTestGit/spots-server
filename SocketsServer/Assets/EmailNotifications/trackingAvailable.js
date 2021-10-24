const generateJobsLink = require("./utils/generateJobLink");
const getJobsImageLink = require("./utils/getJobsImageLink");

const getJobsLink = require("./utils/getJobsLink");

module.exports = {
  en: notificationData => {
    const { job } = notificationData.data;

    return {
      title: "Track Available",
      message: `Hello, Tracking for job entitled ${generateJobsLink(
        job
      )} is now available.<br/>Click below for more details.<br />`,
      buttonText: "View Details",
      buttonPath: getJobsLink(job),
      imageUrl: getJobsImageLink(job)
    };
  }
};
