const dynamoose = require("dynamoose");
dynamoose.AWS.config.update({
  region: 'us-east-2'
});
const uuid = require("uuid");
const { Schema } = dynamoose;

module.exports = dynamoose.model(
  "Transaction",
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
      transactionType: {
        type: String,
        required: true
      },
      ptsOperations: {
        type: "list",
        list: [
          {
            type: "map",
            map: {
              _id: {
                type: String,
                default: uuid.v4
              },
              opType: String,
              amount: Number,
              expirationDate: {
                type: Date
              }
            }
          }
        ]
      },
      financialOperations: {
        type: "list",
        list: [
          {
            type: "map",
            map: {
              _id: {
                type: String,
                default: uuid.v4
              },
              opType: String,
              amount: Number,
              paymentMethod: String,
              paymentTransactionId: String
            }
          }
        ]
      }
    },
    {
      useDocumentTypes: true,
      useNativeBooleans: true,
      timestamps: true
    }
  )
);
