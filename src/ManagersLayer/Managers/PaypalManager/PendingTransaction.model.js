const dynamoose = require("dynamoose");
dynamoose.AWS.config.update({
  region: 'us-east-2'
});
const { Schema } = dynamoose;

const uuid = require("uuid");

module.exports = dynamoose.model(
  "PendingTransaction",
  new Schema(
    {
      transactionId: {
        type: String,
        default: uuid.v4,
        hashKey: true
      },
      paymentItems: Array,
      totalAmount: Number,
      userId: String
    },
    {
      useDocumentTypes: true,
      useNativeBooleans: true,
      timestamps: true
    }
  )
);
