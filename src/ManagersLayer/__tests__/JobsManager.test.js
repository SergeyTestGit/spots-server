// const { expect: chaiExpect } = require("chai");

// const JobsManager = require("../Managers/JobsManager");
// const { ImagesManager } = require("../../../SocketsServer/Managers/ImagesManager");

// const mockedJobData = require("../../tests/mockData/defaultJob");
// const mockedUUID = require("../../tests/mockData/defaultUUID");
// const mockedBase64Image = require("../../tests/mockData/defaultImageBase64");

// const { imageTypes } = require("../../../SocketsServer/Constants/images.constants");

// jest.mock("../Managers/JobsManager/Job");

// describe("Testing JobsManager", () => {
  // describe("testing createJob method", () => {
    // it("should create a new job record", async done => {
    //   const _id = mockedUUID.defaultId;
    //   const expectedResult = {
    //     ...mockedJobData.job,
    //     _id
    //   };

    //   const result = await JobsManager.createJob(mockedJobData.job);

    //   chaiExpect(result).to.be.deep.equal(expectedResult);

    //   done();
    // });

    // it("should create a job and save images", async done => {
    //   ImagesManager.prototype.putImage = jest.fn(
    //     () =>
    //       new Promise(resolve =>
    //         resolve({
    //           filename: `${mockedUUID.defaultId}.ext`
    //         })
    //       )
    //   );

    //   const requestData = {
    //     ...mockedJobData.job,
    //     pics: [mockedBase64Image]
    //   };
    //   console.log('requestData: ', requestData);

    //   const _id = mockedUUID.defaultId;
    //   const expectedResult = {
    //     ...mockedJobData.job,
    //     _id,
    //     pics: [`${mockedUUID.defaultId}.ext`]
    //   };

    //   const expectedPutImageParams = [
    //     {
    //       image: mockedBase64Image,
    //       imageType: imageTypes.jobPics
    //     },
    //     { subfolder: _id }
    //   ];

    //   const response = await JobsManager.createJob(requestData);
    //   console.log('response: ', response);

    //   expect(ImagesManager.prototype.putImage).toBeCalledTimes(1);
    //   expect(ImagesManager.prototype.putImage).toBeCalledWith(
    //     ...expectedPutImageParams
    //   );

    //   chaiExpect(response).to.be.deep.equal(expectedResult);

    //   done();
    // });
  // });

//   describe("testing getJobById method", () => {
//     it("should return a job", async done => {
//       const response = await JobsManager.getJobById();

//       delete response.populate;

//       chaiExpect(response).to.be.deep.equal(mockedJobData.populatedJob);

//       done();
//     });
//   });

//   describe("testing getJobList method", () => {
//     it("should return a job list", async done => {
//       const reponse = await JobsManager.getJobList();

//       chaiExpect(reponse).to.be.deep.equal([]);

//       done();
//     });
//   });
// });
