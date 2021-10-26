const { NODE_ENV } = process.env;
const AuthManager = require(NODE_ENV === 'test' ? "../../ManagersLayer/Managers/AuthManager/AuthManager" : "/opt/AuthManager");

const _ = require("lodash");

module.exports = async (event, options = {}) => {
  if (!process.env.AWS_SAM_LOCAL && !options.forceAuthInvoke) {
    return;
  }

  const authorizationToken = _.get(event, "headers.Authorization", null);

  const authorizerEvent = {
    authorizationToken,
    type: "TOKEN",
    methodArn:
      "arn:aws:execute-api:us-east-2:408275994567:rt3gyimcs1/ESTestInvoke-stage/"
  };

  const [error, policy] = await AuthManager.authorizeEvent(authorizerEvent);

  if (error) {
    throw error;
  }

  const { context, principalId } = policy;

  event.requestContext.authorizer = {
    principalId,
    ...context
  };
};
