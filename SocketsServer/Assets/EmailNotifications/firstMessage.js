const generateUsersLink = require("./utils/generateUserLink");
const generateChatLink = require("./utils/generateChatLink");
const getUsersAvatarLink = require("./utils/getUsersAvatarLink");

module.exports = {
  en: notificationData => {
    const { user, userId } = notificationData.data;
    console.log('generateChatLink(userId): ', generateChatLink(userId));
    return {
      title: "New Message",
      message: `Hello, ${generateUsersLink(
        user
      )} has sent you a message.<br/>Click below for more details.`,
      buttonText: "View Details",
      buttonPath: generateChatLink(userId),
      imageUrl: getUsersAvatarLink(user)
    };
  }
};
