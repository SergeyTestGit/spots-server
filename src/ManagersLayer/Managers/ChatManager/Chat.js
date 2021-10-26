const dynamoose = require("dynamoose");
dynamoose.AWS.config.update({
  region: 'us-east-2'
});
const { Schema } = dynamoose;

const uuid = require("uuid");

const chatMessageModel = {
  _id: {
    type: String,
    default: uuid.v4()
  },
  sender: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  type: {
    type: String
  }
};

module.exports = dynamoose.model(
  "Chat",
  new Schema(
    {
      _id: {
        type: String,
        default: uuid.v4(),
        hashKey: true
      },
      users: {
        type: "list",
        list: [String]
      },
      status: {
        type: String,
        enum: ["active", "inactive", "blocked"]
      },
      messages: {
        type: "list",
        list: [
          {
            type: "map",
            map: chatMessageModel
          }
        ]
      },
      jobId: {
        type: String,
        required: true
      },
      jobTitle: {
        type: String,
        required: true
      },
      blockedBy: {
        type: String
      }
    },
    {
      useDocumentTypes: true,
      useNativeBooleans: true,
      timestamps: true
    }
  )
);
