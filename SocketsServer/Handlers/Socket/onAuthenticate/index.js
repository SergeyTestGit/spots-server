const _ = require("lodash");

const AuthManager = require("../../../Managers/AuthManager");
const SocketManager = require("../../../Managers/Sockets.manager");

module.exports = async (tokenString, socket) => {
  try {
    // check for auth header
    if (!tokenString) return socket.emit("Unauthorized");

    const tokenParts = tokenString.split(/ /);

    // check token structure
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer")
      return socket.emit("Unauthorized");

    // check token
    const user = await AuthManager.getUserByToken(tokenParts[1]);

    if (!user) {
      return socket.emit("Unauthorized");
    }

    SocketManager.registerNewClient(user.username, socket);

    socket.user = user;

    socket.emit("Authorized");

    return user;
  } catch (err) {
    console.log(err);

    socket.emit("Unauthorized");
  }
};
