const _ = require("lodash");

const AuthManager = require("/opt/AuthManager");

module.exports.handler = async (event, context, callback) => {
  console.log("authorizer func start");

  const [error, policy] = await AuthManager.authorizeEvent(event);

  callback(error, policy);
};
