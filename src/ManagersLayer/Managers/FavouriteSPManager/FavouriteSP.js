const dynamoose = require("dynamoose");
dynamoose.AWS.config.update({
  region: 'us-east-2'
});
const { Schema } = dynamoose;

const uuid = require("uuid");

module.exports = dynamoose.model(
  "FavouriteSP",
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
      spId: {
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
