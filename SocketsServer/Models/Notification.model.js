const dynamoose = require("../Libs/Dynamoose.lib");
const uuid = require("uuid");

const { Schema } = dynamoose;

module.exports = dynamoose.model(
  "Notification",
  new Schema(
    {
      _id: {
        type: String,
        default: uuid.v4,
        hashKey: true
      },
      userId: {
        type: String,
        required: true
      },
      notificationType: {
        type: String,
        required: true
      },
      data: {
        type: Object
      },
      read: {
        type: Boolean,
        default: false
      }
    },
    {
      timestamps: true,
      useDocumentTypes: true
    }
  )
);
