// const { expect: chaiExpect } = require("chai");

// const UserDynamoDBManager = require("../Managers/UserDynamoDBManager");
// const UserManager = require("../Managers/UserManager");
// const UserCognitoManager = require("../Managers/UserCognitoManager");
// const { ServicesManager } = require("../Managers/ServicesManager");
// const { ProfileImagesManager } = require("../../../SocketsServer/Managers/ProfileImagesManager");

// const mockedUserData = require("../../tests/mockData/defaultUser");
// const mockedUUID = require("../../tests/mockData/defaultUUID");
// const mockedServicesData = require("../../tests/mockData/defaultService");

// jest.mock("../Managers/ServicesManager/Service");
// jest.mock("../Managers/UserDynamoDBManager/User");
// jest.mock("../../../SocketsServer/Libs/Cognito.lib");

// describe("Testing UserManager", () => {
//   beforeEach(() => {
//     ServicesManager.prototype.getServicesList = jest.fn(async () => [
//       mockedServicesData
//     ]);
//     ProfileImagesManager.prototype.getSignedURLForProfileImage = jest.fn(
//       () => mockedUserData.signedUrl
//     );
//     ProfileImagesManager.prototype.putProfileImage = jest.fn(async () => ({
//       filename: mockedUserData.defaultImageFilename
//     }));
//     ProfileImagesManager.prototype.updateProfileImages = jest.fn(
//       async (type, imgs) => imgs.map(() => mockedUserData.defaultImageFilename)
//     );
//   });

//   describe("Testing getDynamoUserAttributes method", () => {
//     it("should return dynamo user", async done => {
//       const response = await UserDynamoDBManager.getDynamoUserAttributes(
//         mockedUUID.defaultId
//       );

//       delete response.populate;

//       chaiExpect(response).to.be.deep.equal(mockedUserData.dynamoUser);
//       done();
//     });
//   });

//   describe("Testing createNewDynamoUser method", () => {
//     it("should create new user", async done => {
//       const UserModel = require("../Managers/UserDynamoDBManager/User");
//       const newUser = mockedUserData.dynamoUser;

//       const response = await UserDynamoDBManager.createNewDynamoUser(newUser);

//       chaiExpect(response).to.be.deep.equal(new UserModel());

//       done();
//     });
//   });

//   describe("Testing updateDynamoUser", () => {
//     it("should update user", async done => {
//       const userId = mockedUUID.defaultId;
//       const update = mockedUserData.dynamoUser;

//       const expectedResponse = {
//         selector: {
//           _id: userId
//         },
//         update
//       };

//       const response = await UserDynamoDBManager.updateDynamoUser(userId, update);

//       chaiExpect(response).to.be.deep.equal(expectedResponse);

//       done();
//     });
//   });

//   describe("Testing parseCognitoUserAttributes", () => {
//     it("should parse all cognito user attributes", () => {
//       const { UserAttributes } = mockedUserData.cognitoUser;
//       const expectedResponse = mockedUserData.cognitoUserStripped;

//       const response = UserCognitoManager.parseCognitoUserAttributes(UserAttributes);

//       chaiExpect(response).to.be.deep.equal(expectedResponse);
//     });
//   });

//   describe("Testing getCognitoUser", () => {
//     it("should return cognito user", async done => {
//       const accessToken = "token";
//       const expectedResponse = mockedUserData.fullCognitoUserStripped;

//       const response = await UserCognitoManager.getCognitoUser(accessToken);

//       chaiExpect(response).to.be.deep.equal(expectedResponse);

//       done();
//     });
//   });

//   describe("Testing updateCognitoUser", () => {
//     it("should update cognit user attributes", async done => {
//       const AccessToken = "token";
//       const { UserAttributes } = mockedUserData.cognitoUser;

//       const expectedResponse = {
//         AccessToken,
//         UserAttributes
//       };

//       const response = await UserCognitoManager.updateCognitoUser(
//         UserAttributes,
//         AccessToken
//       );

//       chaiExpect(response).to.be.deep.equal(expectedResponse);

//       done();
//     });
//   });

  // describe("Testing populateUserAttributes", () => {
  //   it("should populate user attributes", async done => {
  //     const expectedResponse = mockedUserData.fullPopulatedUser;

  //     const response = await UserManager.populateUserAttributes(
  //       mockedUserData.fullUser
  //     );

  //     chaiExpect(response).to.be.deep.equal(expectedResponse);

  //     done();
  //   });
  // });

//   describe("Testing getFullUser method", () => {
//     it("should return full user", async done => {
//       const AccessToken = "token";

//       const expectedResponse = mockedUserData.fullUser;

//       const response = await UserManager.getFullUser(AccessToken);

//       delete response.populate;

//       chaiExpect(response).to.be.deep.equal(expectedResponse);

//       done();
//     });

//     it("should return full populated user", async done => {
//       const AccessToken = "token";
//       const options = {
//         populate: true
//       };

//       const expectedResponse = mockedUserData.fullPopulatedUser;

//       const response = await UserManager.getFullUser(AccessToken, options);

//       delete response.populate;

//       chaiExpect(response).to.be.deep.equal(expectedResponse);

//       done();
//     });
//   });

//   describe("Testing updateUser method", () => {
//     it("should update user profile including images", async done => {
//       const _id = mockedUUID.defaultId;
//       const AccessToken = "token";

//       const expectedResponse = mockedUserData.getExpectedUpdateResult(
//         _id,
//         AccessToken
//       );

//       const request = mockedUserData.userUpdate;

//       const response = await UserManager.updateUser(request, _id, AccessToken);

//       chaiExpect(response).to.be.deep.equal(expectedResponse);
//       expect(
//         ProfileImagesManager.prototype.updateProfileImages
//       ).toBeCalledTimes(3);
//       expect(ProfileImagesManager.prototype.putProfileImage).toBeCalledTimes(1);

//       done();
//     });
//   });
// });
