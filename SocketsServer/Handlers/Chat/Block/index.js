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
      return res.sendStatus(401);

    // check token
    const user = await AuthManager.getUserByToken(tokenParts[1]);
    console.log('user: ', user);

    if (!user) {
      return res.sendStatus(401);
    }

    const response = await ChatManager.blockChat(
      req.body.chatId,
      user.username
    );

    res.send(response);
  } catch (err) {
    next(err);
  }
};
