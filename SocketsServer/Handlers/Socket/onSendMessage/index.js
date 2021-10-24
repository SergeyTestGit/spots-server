const ChatManager = require("../../../Managers/Chat.manager");

const SocketEventType = require("../../../Constants/socketEventTypes");

module.exports = async (data, connection) => {
  const newMessage = await ChatManager.addMessageToChat(
    data.chatId,
    data.message,
    connection.user.username
  );

  connection.emit(SocketEventType.messageReceived, {
    chatId: data.chatId,
    message: newMessage
  });
};
