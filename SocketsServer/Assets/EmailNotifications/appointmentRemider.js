const generateJobsLink = require("./utils/generateJobLink");
const getJobsImageLink = require("./utils/getJobsImageLink");

const getJobsLink = require("./utils/getJobsLink");

module.exports = {
  en: notificationData => {
    const { job } = notificationData.data;

    return {
      title: "Appointment Reminder",
      message: `Hello, This is your appointment reminder: ${generateJobsLink(
        job,
        true
      )}.<br/>Click below for more details.`,
      buttonText: "View Details",
      buttonPath: getJobsLink(job),
      imageUrl: getJobsImageLink(job)
    };
  }
};
