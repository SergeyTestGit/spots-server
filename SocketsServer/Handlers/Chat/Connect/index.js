const _ = require("lodash");

const AuthManager = require("../../../Managers/AuthManager");
const ChatManager = require("../../../Managers/Chat.manager");

module.exports = async (req, res, next) => {
  try {
    const authHeader = _.get(req, "headers.authorization");

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

    const possibeChatPartners =
      (await ChatManager.getUsersPossibleChatPartners(user.username)) || [];

    if (possibeChatPartners.indexOf(req.body.userId) < 0) {
      res.status(400).send({
        code: "ForbiddenChat",
        message: "You can't chat with this user"
      });

      return;
    }

    const chat = await ChatManager.findOrCreateChat(
      req.body.jobId,
      req.body.jobTitle,
      req.body.userId,
      user.username,
      req.body.blockedBy
    );

    res.status(200).send(chat);
  } catch (err) {
    next(err);
  }
};
