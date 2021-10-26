const dynamoose = require("dynamoose");
dynamoose.AWS.config.update({
  region: 'us-east-2'
});
const { Schema } = dynamoose;

const uuid = require("uuid");

module.exports = dynamoose.model(
  "JobRequest",
  new Schema(
    {
      _id: {
        type: String,
        default: uuid.v4(),
        hashKey: true
      },
      employer: {
        type: String,
        required: true
      },
      doer: {
        type: String,
        required: true
      },
      job: {
        type: String,
        required: true
      },
      suggestedStartDate: {
        type: Date,
        required: false
      },
      suggestedBudget: {
        type: Number,
        required: false,
        validate: value => {
          return value > 0;
        }
      }
    },
    {
      useDocumentTypes: true,
      useNativeBooleans: true,
      timestamps: true
    }
  )
);
