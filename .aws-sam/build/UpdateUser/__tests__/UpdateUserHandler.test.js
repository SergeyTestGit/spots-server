const { expect: chaiExpect } = require("chai");

const { handler } = require("../index");

const { buildResponse } = require("../../../../LibsLayer/ResponseLibLayer/response.lib");

const mockedUserData = require("../../../../tests/mockData/defaultUser");

const { UserManager } = require("../../../../ManagersLayer/Managers/UserManager");

const testData = require("./testConfig");

jest.mock("../../../../ManagersLayer/Managers/ServicesManager/Service");
jest.mock("../../../../ManagersLayer/Managers/CommonManager/Common");
jest.mock("../../../../../SocketsServer/Libs/Cognito.lib");
jest.mock("../../../../HelpersLayer/Helpers/localAuthorizerInvoke");

describe("Testing getFullUser handler", () => {
  beforeEach(() => {
    UserManager.prototype.updateUser = jest.fn(async () => ({}));
    UserManager.prototype.getFullUser = jest.fn(
      async () => mockedUserData.fullUser
    );
  });

  it("should return full user", done => {
    const expectedResponseBody = buildResponse(200, mockedUserData.fullUser);
    console.log('mockedUserData.fullUser: ', mockedUserData.fullUser);
    console.log('testData.validBody: ', testData.validBody);

    handler(
      {
        body: JSON.stringify(testData.validBody)
      },
      {},
      (err, body) => {
        chaiExpect(err).to.be.equal(null);
        chaiExpect(body).to.be.deep.equal(expectedResponseBody);

        done();
      }
    );
  });

//   it("should return bar request error", done => {
//     const expectedResponseBody = buildResponse(400, "Bad Request");

//     handler({}, {}, (err, body) => {
//       chaiExpect(err).to.be.equal(null);
//       chaiExpect(body).to.be.deep.equal(expectedResponseBody);

//       done();
//     });
//   });

//   it("should return validation error for body", done => {
//     const expectedResponseBody = buildResponse(400, {
//       message: "Bad Request",
//       details: [
//         "accessToken is a required field",
//         "sub is a required field",
//         "update is a required field"
//       ]
//     });

//     handler(
//       {
//         body: JSON.stringify(testData.invalidBody)
//       },
//       {},
//       (err, body) => {
//         chaiExpect(err).to.be.equal(null);
//         chaiExpect(body).to.be.deep.equal(expectedResponseBody);

//         done();
//       }
//     );
//   });

//   it("should return validation error for update", done => {
//     const expectedResponseBody = buildResponse(400, {
//       message: "Bad Request",
//       details: [
//         "firstName must be a `string` type, but the final value was: `1`.",
//         'certificates must be a `array` type, but the final value was: `""`.'
//       ]
//     });

//     handler(
//       {
//         body: JSON.stringify({
//           ...testData.validBody,
//           update: testData.invalidUpdate
//         })
//       },
//       {},
//       (err, body) => {
//         chaiExpect(err).to.be.equal(null);
//         chaiExpect(body).to.be.deep.equal(expectedResponseBody);

//         done();
//       }
//     );
//   });

//   it("should return internal server error", done => {
//     UserManager.prototype.getFullUser = jest.fn(async () => {
//       throw Error("test error");
//     });

//     const expectedResponseBody = buildResponse(500, "Internal server error");

//     handler(
//       {
//         body: JSON.stringify(testData.validBody)
//       },
//       {},
//       (err, body) => {
//         chaiExpect(err).to.be.equal(null);
//         chaiExpect(body).to.be.deep.equal(expectedResponseBody);

//         done();
//       }
//     );
//   });
});
