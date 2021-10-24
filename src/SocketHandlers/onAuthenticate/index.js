// const AuthManager = require("/opt/AuthManager");
// const SocketConnectionManager = require("/opt/SocketConnectionManager");

module.exports.handler = async (event, context, callback) => {
  try {
    // try {
    //   await AuthManager.authorizeSocketEvent(event);
    // } catch (err) {
    //   callback(null, {
    //     statusCode: 401,
    //     body: "Failed to authenticate: " + JSON.stringify(err)
    //   });

    //   return;
    // }

    // const { username } = event.user;
    // const { connectionId } = event.requestContext;

    console.log("connectionId", connectionId);
    // console.log("username", username);

    // SocketConnectionManager.saveUserConnection(connectionId, username);

    callback(null, {
      statusCode: 200,
      body: "Connected."
    });
  } catch (err) {
    callback(null, {
      statusCode: 500,
      body: "Failed to authenticate: " + JSON.stringify(err)
    });
  }
};
