const dynamoose = require("dynamoose");
dynamoose.AWS.config.update({
  region: 'us-east-2'
});
const uuid = require("uuid");
const { Schema } = dynamoose;

module.exports = dynamoose.model(
  "Service",
  new Schema(
    {
      _id: {
        type: String,
        default: uuid.v4(),
        hashKey: true
      },
      title: { type: String, required: true },
      orderKey: {
        type: Number
      },
      iconName: {
        type: String
      },
      subservices: {
        type: Array,
        default: []
      }
    },
    {
      useDocumentTypes: true,
      useNativeBooleans: true,
      timestamps: true
    }
  )
);
