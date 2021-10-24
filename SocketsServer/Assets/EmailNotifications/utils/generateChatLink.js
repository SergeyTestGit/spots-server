const { APP_LINK } = require("../../../Configs/client");

module.exports = userId => {
  const chatLink = `${APP_LINK}/chats?userId=${userId}`;

  return chatLink;
};