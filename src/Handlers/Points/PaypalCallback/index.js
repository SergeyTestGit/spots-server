const { buildResponse } = require("/opt/response.lib.js");

const clientRedirectSuccessURI = process.env.PAYPAL_CLIENT_REDIRRECT_SUCCESS;
const clientRedirectFailureURI = process.env.PAYPAL_CLIENT_REDIRRECT_FAILURE;

module.exports.handler = async (event, context, callback) => {
  try {
    const _ = require("lodash");

    const PaypalManager = require("/opt/PaypalManager");

    console.log(event.queryStringParameters)

    const { status, message } = await PaypalManager.callback(
      event.queryStringParameters
    );

    const { $redirect_uri = null } = event.queryStringParameters || {};

    let location =
      status === "Success"
        ? `${$redirect_uri || clientRedirectSuccessURI}?payment_details=`
        : `${$redirect_uri || clientRedirectFailureURI}?error=`;

    location += JSON.stringify(message);

    callback(null, {
      statusCode: 301,
      headers: {
        Location: location
      },
      body: ""
    });
  } catch (error) {
    console.error("paypal callback error, ", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
};
