/**
 * Returns HTTP response with cors headers
 * @statusCode response status code
 * @body response body
 * @headers addittional headers
 */
module.exports.buildResponse = (statusCode, body, headers) => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Cache-Control": "no-cache",
      Expiration: "0",
      "Last-Modified": new Date().toString(),
      "Date": new Date().toString(),
      ...(typeof headers === "object" ? headers : "")
    },
    body: typeof body === "object" ? JSON.stringify(body) : body
  };
};
