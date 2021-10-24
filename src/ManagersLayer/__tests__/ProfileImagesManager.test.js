// const { expect: chaiExpect } = require("chai");

// const ProfileImagesManager = require("../../../SocketsServer/Managers/ProfileImagesManager");
// const { ImagesManager } = require("../../../SocketsServer/Managers/ImagesManager");

// const mockedUUID = require("../../tests/mockData/defaultUUID");
// const mockedImageB64 = require("../../tests/mockData/defaultImageBase64");

// const {
//   profileBucketFolderNames,
//   profileImageTypes
// } = require("../../../SocketsServer/Constants/profileImages.constants");

// jest.mock("../../LibsLayer/__mocks__/S3.lib.js");

// const defaultProfileImagesBucketName = "spotjobs-profile-images-097579889258-us-east-1";

// describe("Testing Profile Images Manager", () => {
//   beforeEach(() => {
//     jest.resetModules(); // this is important
//     process.env.PROFILE_IMAGES_BUCKET_NAME = defaultProfileImagesBucketName;
//   });

//   afterEach(() => {
//     delete process.env.PROFILE_IMAGES_BUCKET_NAME;
//   });

//   describe("testing putProfileImage method", () => {
//     it("should put image to root folder", done => {
//       const filename = `${mockedUUID.defaultId}.png`;
//       const imageType = profileImageTypes.avatar;

//       const expectedResponse = {
//         operation: "putObject",
//         Body: Buffer.from(mockedImageB64, "base64"),
//         Bucket: defaultProfileImagesBucketName,
//         Key: `${profileBucketFolderNames[imageType]}/${filename}`,
//         filename
//       };

//       ProfileImagesManager.putProfileImage({
//         imageType,
//         image: mockedImageB64
//       }).then(response => {
//         chaiExpect(response).to.be.deep.equal(expectedResponse);

//         done();
//       });
//     });

//     it("should put image to subfolder", done => {
//       const filename = `${mockedUUID.defaultId}.png`;
//       const imageType = profileImageTypes.avatar;
//       const subfolder = "subfolder";

//       const expectedResponse = {
//         operation: "putObject",
//         Body: Buffer.from(mockedImageB64, "base64"),
//         Bucket: defaultProfileImagesBucketName,
//         Key: `${profileBucketFolderNames[imageType]}/${subfolder}/${filename}`,
//         filename
//       };

//       ProfileImagesManager.putProfileImage(
//         { imageType, image: mockedImageB64 },
//         { subfolder }
//       ).then(response => {
//         chaiExpect(response).to.be.deep.equal(expectedResponse);

//         done();
//       });
//     });
//   });

//   describe("testing removeProfileImage method", () => {
//     it("should remove image from root folder", done => {
//       const filename = `${mockedUUID.defaultId}.png`;
//       const imageType = profileImageTypes.avatar;

//       const expectedResponse = {
//         operation: "deleteObject",
//         Bucket: defaultProfileImagesBucketName,
//         Key: `${profileBucketFolderNames[imageType]}/${filename}`
//       };

//       ProfileImagesManager.removeProfileImage(imageType, filename).then(
//         response => {
//           chaiExpect(response).to.be.deep.equal(expectedResponse);

//           done();
//         }
//       );
//     });

//     it("should remove image from subfolder", done => {
//       const filename = `${mockedUUID.defaultId}.png`;
//       const imageType = profileImageTypes.avatar;
//       const subfolder = "subfolder";

//       const expectedResponse = {
//         operation: "deleteObject",
//         Bucket: defaultProfileImagesBucketName,
//         Key: `${profileBucketFolderNames[imageType]}/${subfolder}/${filename}`
//       };

//       ProfileImagesManager.removeProfileImage(imageType, filename, {
//         subfolder
//       }).then(response => {
//         chaiExpect(response).to.be.deep.equal(expectedResponse);

//         done();
//       });
//     });
//   });

//   describe("testing getSignedURLForProfileImage method", () => {
//     it("should create signed link for profile file", done => {
//       const userId = mockedUUID.defaultId;
//       const filename = `${mockedUUID.defaultId}.png`;
//       const imageType = profileImageTypes.avatar;

//       const expectedResponse = "https://spotjobs-profile-images-097579889258-us-east-1.s3.amazonaws.com/avatars/1.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARNOBW6JVEBDKSV4B%2F20200121%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20200121T095301Z&X-Amz-Expires=900&X-Amz-Signature=25f27ea6cfa938b24d482a7c3f496b772db5e510dae0bf9178c541ba862c53b2&X-Amz-SignedHeaders=host";

//       const response = ProfileImagesManager.getSignedURLForProfileImage(
//         imageType,
//         filename,
//         userId
//       );

//       chaiExpect(response).to.equal(expectedResponse);

//       done();
//     });
//   });

//   describe("testing updateProfileImages method", () => {
//     it("should should call ImageManager methods with correct params", async done => {
//       ImagesManager.prototype.putImage = jest.fn(() => ({}));
//       ImagesManager.prototype.removeImage = jest.fn(() => ({}));

//       const imageType = profileImageTypes.certificates;
//       const userId = mockedUUID.defaultId;
//       const images = [
//         "some_file_id.ext",
//         mockedImageB64,
//         {
//           status: "deleted",
//           _id: "image_image_to_delete.ext"
//         }
//       ];

//       const expectedPutParameters = [
//         { imageType, image: mockedImageB64 },
//         {
//           subfolder: userId,
//           folderName: profileBucketFolderNames[imageType],
//           bucket: defaultProfileImagesBucketName
//         }
//       ];

//       const expectedRemoveParameters = [
//         imageType,
//         "image_image_to_delete.ext",
//         {
//           subfolder: userId,
//           folderName: profileBucketFolderNames[imageType],
//           bucket: defaultProfileImagesBucketName
//         }
//       ];

//       await ProfileImagesManager.updateProfileImages(imageType, images, userId);

//       expect(ImagesManager.prototype.putImage).toBeCalledTimes(1);
//       expect(ImagesManager.prototype.putImage).toBeCalledWith(
//         ...expectedPutParameters
//       );

//       expect(ImagesManager.prototype.removeImage).toBeCalledTimes(1);
//       expect(ImagesManager.prototype.removeImage).toBeCalledWith(
//         ...expectedRemoveParameters
//       );

//       ImagesManager.prototype.putImage = require("../../../SocketsServer/Managers/ImagesManager").ImagesManager.prototype.putImage;
//       ImagesManager.prototype.removeImage = require("../../../SocketsServer/Managers/ImagesManager").ImagesManager.prototype.removeImage;

//       done();
//     });

//     it("should should return correct image names array", async done => {
//       const imageType = profileImageTypes.certificates;
//       const userId = mockedUUID.defaultId;
//       const images = [
//         "some_file_id.ext",
//         mockedImageB64,
//         {
//           status: "deleted",
//           _id: "image_image_to_delete.ext"
//         }
//       ];

//       const expectedResult = [
//         "some_file_id.ext",
//         `${mockedUUID.defaultId}.png`
//       ];

//       const response = await ProfileImagesManager.updateProfileImages(
//         imageType,
//         images,
//         userId
//       );

//       chaiExpect(response).to.be.deep.equal(expectedResult);

//       done();
//     });
//   });
// });
