const dynamoose = require("dynamoose");
dynamoose.AWS.config.update({
  region: 'us-east-1'
});
const uuid = require("uuid");
const { Schema } = dynamoose;

module.exports = dynamoose.model(
  "Subscription",
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
      subscriptionType: {
        type: String,
        required: true
      },
      transactionId: {
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
