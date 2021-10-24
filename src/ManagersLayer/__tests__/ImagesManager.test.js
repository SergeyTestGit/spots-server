// const { expect } = require("chai");

// const { ImagesManager } = require("../../../SocketsServer/Managers/ImagesManager");

// const mockedS3Data = require("../../tests/mockData/defaultS3data");
// const mockedUUID = require("../../tests/mockData/defaultUUID");
// const mockedImageB64 = require("../../tests/mockData/defaultImageBase64");
// const { bucketFolderNames, imageTypes } = require("../../../shared/nodejs/Constants/images");

// jest.mock("../../../SocketsServer/Libs/S3.lib");

// describe("Testing Images Manager", () => {
//   describe("testing putImage method", () => {
//     it("should put image to root folder", done => {
//       const filename = `${mockedUUID.defaultId}.png`;
//       const imageType = imageTypes.categoryIcon;

//       const expectedResponse = {
//         operation: "putObject",
//         Body: Buffer.from(mockedImageB64, "base64"),
//         Bucket: null,
//         Key: `${bucketFolderNames[imageType]}/${filename}`,
//         filename
//       };

//       ImagesManager.putImage({ imageType, image: mockedImageB64 }).then(
//         response => {
//           expect(response).to.be.deep.equal(expectedResponse);

//           done();
//         }
//       );
//     });

//     it("should put image to subfolder", done => {
//       const filename = `${mockedUUID.defaultId}.png`;
//       const imageType = imageTypes.categoryIcon;
//       const subfolder = "subfolder";

//       const expectedResponse = {
//         operation: "putObject",
//         Body: Buffer.from(mockedImageB64, "base64"),
//         Bucket: null,
//         Key: `${bucketFolderNames[imageType]}/${subfolder}/${filename}`,
//         filename
//       };

//       ImagesManager.putImage(
//         { imageType, image: mockedImageB64 },
//         { subfolder }
//       ).then(response => {
//         expect(response).to.be.deep.equal(expectedResponse);

//         done();
//       });
//     });
//   });

//   describe("testing removeImage method", () => {
//     it("should remove image from root folder", done => {
//       const filename = `${mockedUUID.defaultId}.png`;
//       const imageType = imageTypes.categoryIcon;

//       const expectedResponse = {
//         operation: "deleteObject",
//         Bucket: null,
//         Key: `${bucketFolderNames[imageType]}/${filename}`
//       };

//       ImagesManager.removeImage(imageType, filename).then(response => {
//         expect(response).to.be.deep.equal(expectedResponse);

//         done();
//       });
//     });

//     it("should remove image from subfolder", done => {
//       const filename = `${mockedUUID.defaultId}.png`;
//       const imageType = imageTypes.categoryIcon;
//       const subfolder = "subfolder";

//       const expectedResponse = {
//         operation: "deleteObject",
//         Bucket: null,
//         Key: `${bucketFolderNames[imageType]}/${subfolder}/${filename}`
//       };

//       ImagesManager.removeImage(imageType, filename, { subfolder }).then(
//         response => {
//           expect(response).to.be.deep.equal(expectedResponse);

//           done();
//         }
//       );
//     });
//   });

//   describe("testing getSignedURLForImage method", () => {
//     it("should create signed link for file", done => {
//       const filename = `${mockedUUID.defaultId}.png`;
//       const imageType = imageTypes.categoryIcon;

//       const expectedResponse = {
//         Bucket: mockedS3Data.bucket_name,
//         Key: `${bucketFolderNames[imageType]}/${filename}`,
//         operationType: "getObject"
//       };

//       const response = ImagesManager.getSignedURLForImage(imageType, filename);

//       expect(response).to.be.deep.equal(expectedResponse);

//       done();
//     });

//     it("should create signed link for encrypted file", done => {
//       const filename = `${mockedUUID.defaultId}.png`;
//       const imageType = imageTypes.categoryIcon;
//       const kmsKey = "myKey";

//       const expectedResponse = {
//         Bucket: mockedS3Data.bucket_name,
//         Key: `${bucketFolderNames[imageType]}/${filename}`,
//         SSECustomerAlgorithm: "aws:kms",
//         SSECustomerKey: kmsKey,
//         operationType: "getObject"
//       };

//       const response = ImagesManager.getSignedURLForImage(imageType, filename, {
//         kmsKey
//       });

//       expect(response).to.be.deep.equal(expectedResponse);

//       done();
//     });

//     it("should create signed link for file in subfolder", done => {
//       const filename = `${mockedUUID.defaultId}.png`;
//       const imageType = imageTypes.categoryIcon;
//       const subfolder = "subfolder";

//       const expectedResponse = {
//         Bucket: mockedS3Data.bucket_name,
//         Key: `${bucketFolderNames[imageType]}/${subfolder}/${filename}`,
//         operationType: "getObject"
//       };

//       const response = ImagesManager.getSignedURLForImage(imageType, filename, {
//         subfolder
//       });

//       expect(response).to.be.deep.equal(expectedResponse);

//       done();
//     });
//   });
// });
