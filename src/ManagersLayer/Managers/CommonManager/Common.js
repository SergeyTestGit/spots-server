const dynamoose = require("dynamoose");
dynamoose.AWS.config.update({
  region: 'us-east-1'
});
const { Schema } = dynamoose;

module.exports = dynamoose.model(
  "Common",
  new Schema(
    {
      type: {
        type: String,
        hashKey: true
      },
      val: {
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
