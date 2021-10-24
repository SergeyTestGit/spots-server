const { expect } = require("chai");
const { buildResponse } = require("../ResponseLibLayer/response.lib");

describe("#Testing response lib", () => {
  it("Should build success response", async done => {
    const successBody = {
      foo: "bar"
    };
    const expectedResponse = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Cache-Control": "no-cache",
        "Expiration": "0",
        "Date": (new Date()).toString(),
        "Last-Modified": (new Date()).toString()
      },
      body: JSON.stringify(successBody)
    };

    const response = buildResponse(200, successBody);

    expect(response).to.be.an("object");
    expect(response).to.deep.equal(expectedResponse);

    done();
  });

  it("Should build failure response", async done => {
    const failureBody = "Internal server error";
    const expectedResponse = {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Cache-Control": "no-cache",
        "Expiration": "0",
        "Date": (new Date()).toString(),
        "Last-Modified": (new Date()).toString()
      },
      body: failureBody
    };

    const response = buildResponse(500, failureBody);

    expect(response).to.be.an("object");
    expect(response).to.deep.equal(expectedResponse);
    done();
  });

  it("Should build redirect response", async done => {
    const body = "";
    const redirectHeaders = {
      Location: "www.google.com"
    };
    const expectedResponse = {
      statusCode: 302,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Cache-Control": "no-cache",
        "Expiration": "0",
        "Date": (new Date()).toString(),
        "Last-Modified": (new Date()).toString(),
        ...redirectHeaders
      },
      body
    };

    const response = buildResponse(302, body, redirectHeaders);

    expect(response).to.be.an("object");
    expect(response).to.deep.equal(expectedResponse);
    done();
  });
});
