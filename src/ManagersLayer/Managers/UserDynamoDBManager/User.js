const dynamoose = require("dynamoose");
dynamoose.AWS.config.update({
  region: 'us-east-2'
});
const uuid = require("uuid");
const { Schema } = dynamoose;

module.exports = dynamoose.model(
  "User",
  new Schema(
    {
      _id: {
        type: String,
        default: uuid.v4(),
        hashKey: true
      },
      defaultRadius: {
        type: Number,
        default: 10
      },
      services: {
        type: "list",
        list: [
          {
            type: "map",
            map: {
              categoryId: String,
              serviceId: String,
              status: String
            }
          }
        ]
      },
      websiteLinks: {
        type: "list",
        list: [String]
      },
      videoLinks: {
        type: "list",
        list: [String]
      },
      picsOfWork: {
        type: "list",
        list: [String]
      },
      certificates: {
        type: "list",
        list: [String]
      },
      stars: {
        type: Number,
        default: 0
      }
    },
    {
      timestamps: true,
      useDocumentTypes: true
    }
  )
);
