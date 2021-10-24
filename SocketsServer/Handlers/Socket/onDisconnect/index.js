const SocketManager = require("../../../Managers/Sockets.manager");

module.exports = async (data, connection) => {
  SocketManager.removeClient(connection.user.username);
};
