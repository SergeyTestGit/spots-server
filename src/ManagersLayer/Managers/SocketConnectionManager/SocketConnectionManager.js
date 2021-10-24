const _ = require("lodash");

const SocketConnection = require("./SocketConnection");

class SocketConnectionManager {
  /**
   * Add socket connection to DB
   *
   * @param {String} connectionId Connection ID
   * @param {String} userId User's ID
   */
  saveUserConnection(connectionId, userId) {
    return new Promise((resolve, reject) => {
      const socketConnection = new SocketConnection({
        connectionId,
        userId
      });

      socketConnection.save(err => {
        if (err) {
          reject(err);
        }

        resolve(socketConnection);
      });
    });
  }

  removeConnection(connectionId) {
    return new Promise((resolve, reject) => {
      SocketConnection.delete({ connectionId }, err => {
        if (err) return reject(err);

        resolve();
      });
    });
  }
}

module.exports = SocketConnectionManager;
