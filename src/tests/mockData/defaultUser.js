const mockedService = require("./defaultService");

const signedUrl = "signed_url";
const defaultImageFilename = "profile_image";

const defaultDynamoUser = {
  _id: "id",
  defaultRadius: 10,
  services: [
    {
      _id: mockedService.subservices[0]._id,
      categoryId: mockedService._id,
      status: "active"
    }
  ],
  websiteLinks: [],
  videoLinks: [],
  certificates: ["pic"],
  picsOfWork: ["pic"]
};

const defaultCognitoUser = {
  UserAttributes: [
    {
      Name: "sub",
      Value: "id"
    },
    {
      Name: "given_name",
      Value: "Lorem"
    },
    {
      Name: "family_name",
      Value: "Ipsum"
    },
    {
      Name: "custom:avatarUrl",
      Value: "url"
    },
    {
      Name: "idPics",
      Value: "first|second"
    }
  ]
};

const defaultCognitoUserStripped = {
  sub: "id",
  given_name: "Lorem",
  family_name: "Ipsum",
  avatarUrl: "url",
  idPics: "first|second"
};

const fullCognitoUserStripped = {
  username: "username",
  sub: "id",
  given_name: "Lorem",
  family_name: "Ipsum",
  avatarUrl: "url",
  idPics: ["first", "second"]
};

const fullUser = {
  ...defaultDynamoUser,
  ...fullCognitoUserStripped
};

const fullPopulatedUser = {
  ...fullUser,
  activeSubscription: null,
  ptsAmount: 0,
  ptsExpirationDate: (new Date()).toISOString(),
  services: [{ ...fullUser.services[0], ...mockedService.subservices }]
};

const UserUpdate = {
  isProvider: true,
  avatarB64: "image",
  certificates: ["image"],
  picsOfWork: ["image"],
  idPics: ["image1", "image2"],
  firstName: "Lorem"
};

const getExpectedResult = (_id, AccessToken) => ({
  dynamo: {
    selector: { _id },
    update: {
      certificates: [defaultImageFilename],
      picsOfWork: [defaultImageFilename]
    }
  },
  cognito: {
    AccessToken,
    UserAttributes: [
      {
        Name: "custom:isProvider",
        Value: 1
      },
      {
        Name: "custom:avatarURL",
        Value: defaultImageFilename
      },
      {
        Name: "custom:idPics",
        Value: `${defaultImageFilename}|${defaultImageFilename}`
      },
      {
        Name: "given_name",
        Value: "Lorem"
      }
    ]
  }
});

module.exports.dynamoUser = defaultDynamoUser;
module.exports.cognitoUser = defaultCognitoUser;
module.exports.cognitoUserStripped = defaultCognitoUserStripped;
module.exports.fullUser = fullUser;
module.exports.fullPopulatedUser = fullPopulatedUser;
module.exports.signedUrl = signedUrl;
module.exports.fullCognitoUserStripped = fullCognitoUserStripped;
module.exports.getExpectedUpdateResult = getExpectedResult;
module.exports.userUpdate = UserUpdate;
module.exports.defaultImageFilename = defaultImageFilename;
