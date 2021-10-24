const dataMock = require("../../tests/mockData/defaultS3data");

module.exports.call = async function(operation, params) {
  return {
    ...params,
    operation
  };
};

module.exports.instance = {
  getSignedUrl: function(operationType, params) {
    return {
      ...params,
      operationType
    };
  }
};

module.exports.DEFAULT_BUCKET_NAME = dataMock.bucket_name;
