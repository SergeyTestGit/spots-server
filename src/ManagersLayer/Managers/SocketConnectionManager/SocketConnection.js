const dynamoose = require("dynamoose");
const { Schema } = dynamoose;

const SocketConnectionStatus = require("/opt/nodejs/Constants/SocketConnectionsStatus.js");

module.exports = dynamoose.model(
  "SocketConnection",
  new Schema(
    {
      connectionId: {
        type: String,
        required: true
      },
      userId: {
        type: String,
        default: ""
      },
      status: {
        type: String,
        defaul: SocketConnectionStatus.unauthorized
      }
    },
    {
      useDocumentTypes: true,
      useNativeBooleans: true,
      timestamps: true
    }
  )
);
