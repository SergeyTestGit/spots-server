const dynamoose = require("../Libs/Dynamoose.lib");
const uuid = require("uuid");

const { Schema } = dynamoose;

module.exports = dynamoose.model(
  "Chat",
  new Schema(
    {
      _id: {
        type: String,
        default: uuid.v4,
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
            map: {
              _id: {
                type: String,
                default: uuid.v4
              },
              duration: Number,
              sender: String,
              text: String,
              type: String,
              createdAt: {
                type: String,
                default: Date.now
              }
            }
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
      timestamps: true,
      useDocumentTypes: true
    }
  )
);
