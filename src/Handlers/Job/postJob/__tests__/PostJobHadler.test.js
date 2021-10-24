// const { expect: chaiExpect } = require("chai");

// const { handler } = require("../index");

// const { buildResponse } = require("../../../../LibsLayer/ResponseLibLayer/response.lib");

// const JobsManager = require("../../../../ManagersLayer/Managers/JobsManager");

// const mockedUserData = require("../../../../tests/mockData/defaultUser");

// const { validJob, invalidJob, requestData } = require("./testConfig");

// jest.mock("../../../../ManagersLayer/Managers/JobsManager/Job");
// jest.mock("../../../../ManagersLayer/Managers/CommonManager/Common");
// jest.mock("../../../..//HelpersLayer/Helpers/localAuthorizerInvoke");

// describe("Testing createJob handler", () => {
//   it("should return created job", done => {
//     JobsManager.prototype.createJob = jest.fn(async data => data);

//     const expectedJob = validJob;

//     expectedJob.doneBefore = new Date(validJob.doneBefore || "");
//     expectedJob.expiryDate = new Date(validJob.expiryDate || "");

//     const expectedResponseBody = buildResponse(200, expectedJob);

//     handler(
//       {
//         body: JSON.stringify(requestData),
//         requestContext: {
//           authorizer: {
//             token: "token",
//             user: JSON.stringify(mockedUserData.fullCognitoUserStripped)
//           }
//         }
//       },
//       {},
//       (err, body) => {
//         chaiExpect(err).to.be.equal(null);
//         chaiExpect(body).to.be.deep.equal(expectedResponseBody);

//         expect(JobsManager.prototype.createJob).toBeCalledTimes(1);
//         expect(JobsManager.prototype.createJob).toBeCalledWith(validJob);

//         done();
//       }
//     );
//   });

//   it("should return bad response error", done => {
//     JobsManager.prototype.createJob = jest.fn(async () => {
//       throw Error("test error");
//     });

//     const expectedResponseBody = buildResponse(400, "Bad Request");

//     handler(
//       {
//         requestContext: {
//           authorizer: {
//             token: "token",
//             user: JSON.stringify(mockedUserData.fullCognitoUserStripped)
//           }
//         }
//       },
//       {},
//       (err, body) => {
//         chaiExpect(err).to.be.equal(null);
//         chaiExpect(body).to.be.deep.equal(expectedResponseBody);

//         done();
//       }
//     );
//   });

//   it("should return validation error", done => {
//     JobsManager.prototype.createJob = jest.fn(async () => {
//       throw Error("test error");
//     });

//     const expectedResponseBody = buildResponse(400, {
//       message: "Bad Request",
//       details: [
//         "category is a required field",
//         "title is a required field",
//         "doneBefore must be a `date` type, but the final value was: `Invalid Date`.",
//         "expiryDate must be a `date` type, but the final value was: `Invalid Date`.",
//         "budget is a required field"
//       ]
//     });

//     handler(
//       {
//         body: JSON.stringify({})
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
//     JobsManager.prototype.createJob = jest.fn(async () => {
//       throw Error("test error");
//     });

//     const expectedResponseBody = buildResponse(500, "Internal server error");

//     handler(
//       {
//         body: JSON.stringify(requestData),
//         requestContext: {
//           authorizer: {
//             token: "token",
//             user: JSON.stringify(mockedUserData.fullCognitoUserStripped)
//           }
//         }
//       },
//       {},
//       (err, body) => {
//         chaiExpect(err).to.be.equal(null);
//         chaiExpect(body).to.be.deep.equal(expectedResponseBody);

//         done();
//       }
//     );
//   });
// });
