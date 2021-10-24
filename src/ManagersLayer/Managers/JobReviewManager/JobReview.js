const dynamoose = require("dynamoose");
dynamoose.AWS.config.update({
  region: 'us-east-1'
});
const { Schema } = dynamoose;

const uuid = require("uuid");

module.exports = dynamoose.model(
  "JobReview",
  new Schema(
    {
      _id: {
        type: String,
        default: uuid.v4(),
        hashKey: true
      },
      jobId: {
        type: String,
        required: true
      },
      author: {
        type: String,
        required: true
      },
      reviewedUserId: {
        type: String,
        required: true
      },
      rate: {
        type: Number,
        required: true,
        validate: value => {
          return value >= 0 && value <= 5;
        }
      },
      comment: {
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
