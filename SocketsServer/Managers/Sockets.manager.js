const CLIENTS = {};

class SocketManager {
  /**
   * Register new Socket Client
   *
   * @param {String} username User's username
   * @param {*} connection Socket connection
   */
  registerNewClient(username, connection) {
    CLIENTS[username] = connection;
  }

  /**
   * Remove Socket Client
   *
   * @param {String} username
   */
  removeClient(username, isAdmin) {
    CLIENTS[username] = undefined;
  }

  /**
   *  Send message to socket connection
   *
   * @param {*} identifier one of `{  username }`
   * @param {*} message Message
   */
  async sendMessage(identifier, type, message) {
    console.log("sendMessage", identifier, type, message);
    let usersConnection = null;

    usersConnection = CLIENTS[identifier.username];

    if (!usersConnection) {
      throw {
        code: "NoSocketConnection"
      };
    }

    usersConnection.emit(type, message);
  }
}

module.exports = new SocketManager();
