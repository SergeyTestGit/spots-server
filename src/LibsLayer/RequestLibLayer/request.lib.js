const { NODE_ENV } = process.env;
const _ = require("lodash");
const localAuthorizerInvoke = require(NODE_ENV === 'test' ? "../../HelpersLayer/Helpers/localAuthorizerInvoke" : "/opt/Helpers/localAuthorizerInvoke");

const { buildResponse } = require(NODE_ENV === 'test' ? "../ResponseLibLayer/response.lib" : "/opt/response.lib.js");

module.exports.preproccessBody = async (
  event,
  callback,
  validationSchema,
  bodyPreValidationProcess = null
) => {
  let data = null;

  if (!event.body) {
    callback(null, buildResponse(400, "Bad Request"));

    return data;
  }

  try {
    data = JSON.parse(event.body);
  } catch (error) {
    callback(null, buildResponse(400, "Bad Request"));

    return null;
  }

  if (_.isFunction(bodyPreValidationProcess)) {
    data = bodyPreValidationProcess(data);
  }

  if (validationSchema) {
    try {
      await validationSchema.validate(data, {
        strict: true,
        abortEarly: false
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        callback(
          null,
          buildResponse(400, {
            message: "Bad Request",
            details: error.errors
          })
        );

        return null;
      } else {
        throw error;
      }
    }
  }

  return data;
};

module.exports.getUserFromEvent = async (event, options = {}) => {
  if (!options.disableLocalAuth) {
    try {
      await localAuthorizerInvoke(event, options);
    } catch (error) {
      return [null];
    }
  }

  const authorizerContext = _.get(event, "requestContext.authorizer", null);

  if (!authorizerContext) return [null];

  const cognitoUser = authorizerContext.user
    ? JSON.parse(authorizerContext.user)
    : null;

  return [cognitoUser, authorizerContext];
};
