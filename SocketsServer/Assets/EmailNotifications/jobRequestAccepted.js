const generateUsersLink = require("./utils/generateUserLink");
const generateJobsLink = require("./utils/generateJobLink");
const getUsersAvatarLink = require("./utils/getUsersAvatarLink");

const getUsersLink = require("./utils/getUsersLink");

module.exports = {
  en: notificationData => {
    const { job, user } = notificationData.data;

    return {
      title: "Job Request Accepted",
      message: `Hello, ${generateUsersLink(
        user
      )} has accepted your offer for the job entitled ${generateJobsLink(
        job
      )}.<br/>Click below for more details.`,
      buttonText: "View Details",
      buttonPath: getUsersLink(user),
      imageUrl: getUsersAvatarLink(user)
    };
  }
};
