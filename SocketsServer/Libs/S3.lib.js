const AWS = require("./AWS.lib");
const { DEFAULT_BUCKET_NAME } = require("../Constants/s3.constants");

const s3 = new AWS.S3({
  signatureVersion: "v4",
  region: "us-east-1",
  s3DisableBodySigning: false
});

module.exports.call = (action, params) => {
  if (!params.Bucket) {
    params.Bucket = DEFAULT_BUCKET_NAME;
  }

  return s3[action](params).promise();
};

module.exports = s3;
