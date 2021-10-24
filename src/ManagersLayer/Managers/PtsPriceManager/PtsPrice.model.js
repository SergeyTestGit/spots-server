const dynamoose = require("dynamoose");
dynamoose.AWS.config.update({
  region: 'us-east-1'
});
const { Schema } = dynamoose;

const uuid = require("uuid");

module.exports = dynamoose.model(
  "PtsPrice",
  new Schema(
    {
      _id: {
        type: String,
        default: uuid.v4,
        hashKey: true
      },
      region: {
        type: String,
        required: true
      },
      price: {
        type: Number,
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
