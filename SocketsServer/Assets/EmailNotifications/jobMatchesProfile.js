const generateJobsLink = require("./utils/generateJobLink");
const getJobsImageLink = require("./utils/getJobsImageLink");

const getJobsLink = require("./utils/getJobsLink");

module.exports = {
  en: notificationData => {
    const { job } = notificationData.data;

    return {
      title: "Job Match",
      message: `Hello, The following job entitled ${generateJobsLink(
        job
      )} matches your profile.<br/>Click below for more details.<br />Feel free to share this link with friends who might also be interested.`,
      buttonText: "View Details",
      buttonPath: getJobsLink(job),
      imageUrl: getJobsImageLink(job)
    };
  }
};
