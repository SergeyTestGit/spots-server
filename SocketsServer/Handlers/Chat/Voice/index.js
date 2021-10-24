const _ = require("lodash");

const AuthManager = require("../../../Managers/AuthManager");
const ChatManager = require("../../../Managers/Chat.manager");
const VoiceMessagesManager = require("../../../Managers/VoiceMessagesManager");

module.exports = async (req, res, next) => {
  try {
    const { chatId, senderId, duration } = req.body;
    console.log('req: ', req);
    const authHeader = _.get(req, "headers.authorization");

    // check for auth header
    if (!authHeader) return res.status(401).send();

    const tokenParts = authHeader.split(/ /);

    // check token structure
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer")
      return res.sendStatus(401);

    // check token
    const user = await AuthManager.getUserByToken(tokenParts[1]);

    if (!user) {
      return res.sendStatus(401);
    }

    const { Location } = await VoiceMessagesManager.putVoiceMessage(req.file);
    const message = {
      text: Location,
      type: 'voice_message',
      duration
    }
    const response = await ChatManager.addMessageToChat(chatId, message, senderId);

    res.send(response);
  } catch (err) {
    next(err);
  }
};
