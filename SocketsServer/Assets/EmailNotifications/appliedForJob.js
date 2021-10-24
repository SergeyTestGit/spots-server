const generateUsersLink = require("./utils/generateUserLink");
const generateJobsLink = require("./utils/generateJobLink");
const getUsersAvatarLink = require("./utils/getUsersAvatarLink");

const getUsersLink = require("./utils/getUsersLink");

module.exports = {
  en: notificationData => {
    const { job, user } = notificationData.data;

    return {
      title: "New application",
      message: `${generateUsersLink(
        user
      )} applied for the job ${generateJobsLink(
        job
      )}.<br/>Click below for more details.`,
      buttonText: "View Details",
      buttonPath: getUsersLink(user),
      imageUrl: getUsersAvatarLink(user)
    };
  }
};
