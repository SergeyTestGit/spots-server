const { NODE_ENV } = process.env;
const dynamoose = require("dynamoose");
dynamoose.AWS.config.update({
  region: 'us-east-1'
});
const { Schema } = dynamoose;

const shortid = require("shortid");

const jobStatus = require(NODE_ENV === 'test' ? "../../../../SocketsServer/Constants/jobStatus" : "/opt/nodejs/Constants/jobStatus");
const { currencyCodesList } = require(NODE_ENV === 'test' ? "../../../../shared/nodejs/Constants/currency" : "/opt/nodejs/Constants/currency");

module.exports = dynamoose.model(
  "Job",
  new Schema(
    {
      _id: {
        type: String,
        default: shortid.generate(),
        hashKey: true
      },
      author: {
        type: String,
        required: true
      },
      category: {
        type: String,
        required: true
      },
      service: {
        type: String
      },
      title: {
        type: String,
        required: true
      },
      doneBefore: {
        type: Date,
        required: true
      },
      expiryDate: {
        type: Date,
        required: true
      },
      description: {
        type: String
      },
      budget: {
        type: Number,
        required: true,
        validate: value => {
          return value > 0;
        },
        default: []
      },
      currency: {
        type: String,
        required: true,
        enum: currencyCodesList
      },
      pics: {
        type: "list",
        list: [String]
      },
      videoLinks: {
        type: "list",
        list: [String]
      },
      streetAddress: {
        type: String
      },
      city: {
        type: String
      },
      state: {
        type: String
      },
      zipCode: {
        type: String
      },
      country: {
        type: String
      },
      geolocation: {
        type: String
      },
      doer: {
        type: String
      },
      jobStatus: {
        type: String,
        required: true,
        default: jobStatus.posted,
        enum: Object.keys(jobStatus)
      },
      startDate: {
        type: Date
      },
      endDate: {
        type: Date
      },
      canceledReason: {
        type: String
      },
      jobUnavailable: {
        type: Boolean
      }
    },
    {
      useDocumentTypes: true,
      useNativeBooleans: true,
      timestamps: true,
      serverSideEncryption: true
    }
  )
);
