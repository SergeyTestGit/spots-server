// const { expect: chaiExpect } = require("chai");

// const { handler } = require("../index");

// const { buildResponse } = require("../../../../LibsLayer/ResponseLibLayer/response.lib");

// const mockedUserData = require("../../../../tests/mockData/defaultUser");

// const JobsManager = require("../../../../ManagersLayer/Managers/JobsManager");

// jest.mock("../../../../ManagersLayer/Managers/JobsManager/Job");

// describe("Testing getJobById handler", () => {
//   it("should return ", done => {
//     JobsManager.prototype.getJobById = jest.fn(
//       async () => mockedUserData.fullUser
//     );

//     const testId = "test_id";

//     const expectedResponseBody = buildResponse(200, mockedUserData.fullUser);

//     handler(
//       {
//         pathParameters: {
//           id: testId
//         }
//       },
//       {},
//       (err, body) => {
//         chaiExpect(err).to.be.equal(null);
//         chaiExpect(body).to.be.deep.equal(expectedResponseBody);

//         expect(JobsManager.prototype.getJobById).toBeCalledTimes(1);
//         expect(JobsManager.prototype.getJobById).toBeCalledWith(testId);

//         done();
//       }
//     );
//   });

//   it("should return bad response error", done => {
//     JobsManager.prototype.getJobById = jest.fn(async () => {
//       throw Error("test error");
//     });

//     const expectedResponseBody = buildResponse(400, "Bad Request");

//     handler({}, {}, (err, body) => {
//       chaiExpect(err).to.be.equal(null);
//       chaiExpect(body).to.be.deep.equal(expectedResponseBody);

//       done();
//     });
//   });

//   it("should return internal server error", done => {
//     JobsManager.prototype.getJobById = jest.fn(async () => {
//       throw Error("test error");
//     });

//     const testId = "test_id";

//     const expectedResponseBody = buildResponse(500, "Internal server error");

//     handler(
//       {
//         pathParameters: {
//           id: testId
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
