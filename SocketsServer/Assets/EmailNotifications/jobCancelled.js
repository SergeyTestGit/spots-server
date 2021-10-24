const generateJobsLink = require("./utils/generateJobLink");
const getJobsImageLink = require("./utils/getJobsImageLink");

const getJobsLink = require("./utils/getJobsLink");

module.exports = {
  en: notificationData => {
    const { job } = notificationData.data;

    return {
      title: "Job Canceled",
      message: `Hello, This job is cancelled: ${generateJobsLink(
        job
      )}. Reason for cancelling: ${
        job.canceledReason
      }.<br/>Click below for more details.`,
      buttonText: "View Details",
      buttonPath: getJobsLink(job),
      imageUrl: getJobsImageLink(job)
    };
  }
};
