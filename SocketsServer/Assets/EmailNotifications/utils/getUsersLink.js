const { APP_LINK } = require("../../../Configs/client");

module.exports = usersProfile => {
  const usersProfileLink = `${APP_LINK}/find-help/${usersProfile.username}`;

  return usersProfileLink;
};
