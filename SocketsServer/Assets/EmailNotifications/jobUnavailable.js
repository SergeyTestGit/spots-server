const generateJobsLink = require("./utils/generateJobLink");
const getJobsImageLink = require("./utils/getJobsImageLink");

const getJobsLink = require("./utils/getJobsLink");

module.exports = {
  en: notificationData => {
    const { job } = notificationData.data;

    return {
      title: "Job Unavailable",
      message: `Hello, This Job is no longer available: ${generateJobsLink(
        job
      )}.<br/>Click below for more details.`,
      buttonText: "View Details",
      buttonPath: getJobsLink(job),
      imageUrl: getJobsImageLink(job)
    };
  }
};
