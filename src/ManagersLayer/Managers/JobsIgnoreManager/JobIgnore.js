const dynamoose = require("dynamoose");
const { Schema } = dynamoose;

const uuid = require("uuid");

module.exports = dynamoose.model(
  "JobIgnore",
  new Schema(
    {
      _id: {
        type: String,
        default: uuid.v4(),
        hashKey: true
      },
      userId: {
        type: String,
        rangeKey: true,
        required: true
      },
      jobId: {
        type: String,
        required: true
      }
    },
    {
      useDocumentTypes: true,
      useNativeBooleans: true,
      timestamps: true,
      expires: 60 * 60 * 24 * 90 // 90 days in seconds
    }
  )
);
