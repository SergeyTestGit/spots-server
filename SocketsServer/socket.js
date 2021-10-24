const io = require("socket.io");

const socketEvents = require("./Handlers/Socket");
const socketEventType = require("./Constants/socketEventTypes");

const initSocket = server => {
  const socket = io(server, {
    path: "/socket"
  });

  socket.on("connection", userSocket => {
    console.log("connection");
    Object.keys(socketEvents).forEach(event => {
      userSocket.on(event, data => {
        console.log(event, data);

        if (event !== socketEventType.authenticate && !userSocket.user) {
          socket.emit("Unauthorized");

          return;
        }

        socketEvents[event](data, userSocket);
      });
    });
  });
};

module.exports.initSocket = initSocket;
