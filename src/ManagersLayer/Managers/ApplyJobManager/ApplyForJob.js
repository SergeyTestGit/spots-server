const { NODE_ENV } = process.env;
const dynamoose = require("dynamoose");
dynamoose.AWS.config.update({
  region: 'us-east-2'
});
const { Schema } = dynamoose;

const uuid = require("uuid");

const jobApplicationStatus = require(NODE_ENV === 'test' ? "../../../../shared/nodejs/Constants/jobApplicationStatus" : "/opt/nodejs/Constants/jobApplicationStatus");

module.exports = dynamoose.model(
  "ApplyForJob",
  new Schema(
    {
      _id: {
        type: String,
        default: uuid.v4(),
        hashKey: true
      },
      userId: {
        type: String,
        required: true
      },
      jobId: {
        type: String,
        required: true
      },
      suggestedDate: {
        type: Date,
        required: false,
        default: null
      },
      status: {
        type: String,
        required: true,
        default: jobApplicationStatus.applied,
        enum: Object.keys(jobApplicationStatus)
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
