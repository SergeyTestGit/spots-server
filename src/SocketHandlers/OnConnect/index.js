module.exports.handler = (event, context, callback) => {
  try {
    const { connectionId } = event.requestContext;

    console.log("connectionId", connectionId);

    callback(null, {
      statusCode: 200,
      body: "Connected."
    });
  } catch (err) {
    console.log(err);
    callback(null, {
      statusCode: 500,
      body: "Failed to connect: " + JSON.stringify(err)
    });
  }
};
