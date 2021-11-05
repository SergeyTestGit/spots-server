const { expect: chaiExpect } = require("chai");

const { handler } = require("../index");

const { buildResponse } = require("../../../../LibsLayer/ResponseLibLayer/response.lib");

const mockedUserData = require("../../../../tests/mockData/defaultUser");

const UserManager = require("../../../../ManagersLayer/Managers/UserManager/UserManager");

jest.mock("../../../../ManagersLayer/Managers/ServicesManager/Service");
jest.mock("../../../../ManagersLayer/Managers/UserDynamoDBManager/User");
jest.mock("../../../../../SocketsServer/Libs/Cognito.lib");
jest.mock("../../../../HelpersLayer/Helpers/localAuthorizerInvoke");

describe("Testing getFullUser handler", () => {
  it("should return full user", done => {
    UserManager.prototype.getFullUser = jest.fn(
      async () => mockedUserData.fullUser
    );
  
    console.log('mockedUserData.fullUser: ', mockedUserData.fullUser);
    const token = "token";
    const user = "id";

    const expectedResponseBody = buildResponse(200, mockedUserData.fullUser);

    handler(
      {
        requestContext: {
          authorizer: {
            token,
            user
          }
        }
      },
      {},
      (err, body) => {
        chaiExpect(err).to.be.equal(null);
        chaiExpect(body).to.be.deep.equal(expectedResponseBody);

        done();
      }
    );
  });

  // it("should return bad request error", done => {
  //   UserManager.prototype.getFullUser = jest.fn(
  //     async () => mockedUserData.fullUser
  //   );

  //   const expectedResponseBody = buildResponse(400, 'Internal server error');

  //   handler({}, {}, (err, body) => {
  //     chaiExpect(err).to.be.equal(null);
  //     chaiExpect(body).to.be.deep.equal(expectedResponseBody);

  //     done();
  //   });
  // });

  // it("should return error", done => {
  //   UserManager.prototype.getFullUser = jest.fn(async () => {
  //     return new Error({code: "NotAuthorizedException"});
  //   });

  //   const token = "token";

  //   const expectedResponseBody = buildResponse(401, "Unathorized");

  //   handler({}, {}, (err, body) => {
  //     chaiExpect(err).to.be.equal(null);
  //     chaiExpect(body).to.be.deep.equal(expectedResponseBody);

  //     done();
  //   });
  // });
});
