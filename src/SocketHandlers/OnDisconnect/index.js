const SocketConnectionManager = require("../../ManagersLayer/Managers/SocketConnectionManager");

module.exports.handler = (event, context, callback) => {
  try {
    const { connectionId } = event.requestContext;

    console.log("connectionId", connectionId);

    SocketConnectionManager.removeConnection(connectionId);

    callback(null, {
      statusCode: 200,
      body: "Disconnected."
    });
  } catch (err) {
    callback(null, {
      statusCode: 500,
      body: "Failed to disconnect: " + JSON.stringify(err)
    });
  }
};
