// const { expect: chaiExpect } = require("chai");

// const { handler } = require("../index");

// const { buildResponse } = require("../../../../LibsLayer/ResponseLibLayer/response.lib");

// const mockedServiceData = require("../../../../tests/mockData/defaultService");

// const ServicesManager = require("../../../../ManagersLayer/Managers/ServicesManager");

// jest.mock("../../../../ManagersLayer/Managers/ServicesManager/Service");
// jest.mock("../../../../ManagersLayer/Managers/CommonManager/Common");

// describe("Testing getPopularServices handler", () => {
//   it("should return services list", done => {
//     ServicesManager.prototype.getPopularServices = jest.fn(async () => [
//       mockedServiceData
//     ]);

//     const expectedResponseBody = buildResponse(200, [mockedServiceData]);

//     handler({}, {}, (err, body) => {
//       chaiExpect(err).to.be.equal(null);
//       chaiExpect(body).to.be.deep.equal(expectedResponseBody);

//       done();
//     });
//   });

//   it("should return internal server error", () => {
//     ServicesManager.prototype.getPopularServices = jest.fn(async () => {
//       throw Error("test error");
//     });

//     const expectedResponseBody = buildResponse(500, "Internal server error");

//     handler({}, {}, (err, body) => {
//       chaiExpect(err).to.be.equal(null);
//       chaiExpect(body).to.be.deep.equal(expectedResponseBody);

//       done();
//     });
//   });
// });
