const AuthManager = require("/opt/AuthManager");

module.exports.handler = async (event, context, callback) => {
  try {
    try {
      await AuthManager.authorizeSocketEvent(event);
    } catch (err) {
      callback(null, {
        statusCode: 401,
        body: "Failed to authenticate: " + JSON.stringify(err)
      });

      return;
    }

    const { username } = event.user;

    console.log("sender username", username);

    const body = JSON.parse(event.body);
    const { data } = body;

    console.log(data);

    callback(null, {
      statusCode: 200,
      body: "sent."
    });
  } catch (err) {
    callback(null, {
      statusCode: 500,
      body: "Failed to send message: " + JSON.stringify(err)
    });
  }
};
