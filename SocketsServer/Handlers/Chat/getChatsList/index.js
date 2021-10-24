const _ = require("lodash");

const AuthManager = require("../../../Managers/AuthManager");
const ChatsManager = require("../../../Managers/Chat.manager");
const UserCognitoManager = require("../../../Managers/UserCognitoManager");

const getPageList = require("../../../Helpers/getPageList");

const defaultQueryParams = {
  elements_per_page: 10,
  page_number: 0
};

module.exports = async (req, res, next) => {
  try {
    const authHeader = _.get(req, "headers.authorization");
    const queryParamsRaw = _.get(req, "query", {});
    const queryParams = _.defaults(queryParamsRaw, defaultQueryParams);

    // check for auth header
    if (!authHeader) return res.status(401).send();

    const tokenParts = authHeader.split(/ /);

    // check token structure
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer")
      return res.status(401).send();

    // check token
    const user = await AuthManager.getUserByToken(tokenParts[1]);

    if (!user) {
      return res.status(401).send();
    }

    const chatList = await ChatsManager.getUsersActiveChats(user.username);

    const pageData = getPageList(
      chatList,
      queryParams.page_number,
      queryParams.elements_per_page
    );

    const chatWithPartnersPromises = pageData.list.map(async chat => {
      const partnerId = _.find(
        chat.users,
        chatUser => chatUser !== user.username
      );

      chat.messages = _.takeRight(chat.messages, 1);

      chat.partner = _.pick(
        await UserCognitoManager.getCognitoUser({
          username: partnerId
        }),
        ["given_name", "family_name", "username", "avatarURL", "isPremium"]
      );

      return chat;
    });

    pageData.list = await Promise.all(chatWithPartnersPromises);

    res.status(200).send(pageData);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
