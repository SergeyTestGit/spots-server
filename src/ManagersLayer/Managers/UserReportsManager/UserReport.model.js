const dynamoose = require("dynamoose");
const uuid = require("uuid");
const { Schema } = dynamoose;

module.exports = dynamoose.model(
  "UserReport",
  new Schema(
    {
      _id: {
        type: String,
        default: uuid.v4,
        hashKey: true
      },
      senderId: {
        type: String,
        required: true
      },
      userId: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      }
    },
    {
      useDocumentTypes: true,
      useNativeBooleans: true,
      timestamps: true
    }
  )
);
