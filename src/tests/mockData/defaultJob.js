const category = require("./defaultService");

const job = {
  _id: "id",
  category: "some_unical_id",
  service: "some_unical_service_id",
  title: "some title",
  budget: 100,
  doneBefore: "2019-01-28T11:56:58.605Z",
  expiryDate: "2019-01-28T11:56:58.605Z"
};

module.exports.job = job;

module.exports.populatedJob = {
  ...job,
  category
};
