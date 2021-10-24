const mockData = require("../src/tests/mockData/defaultUUID");

module.exports = {
  v4: function() {
    return mockData.defaultId;
  }
};
