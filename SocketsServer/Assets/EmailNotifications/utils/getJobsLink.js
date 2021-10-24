const { APP_LINK } = require("../../../Configs/client");

module.exports = job => {
  const jobsLink = `${APP_LINK}/find-jobs/list/${job._id}`;

  return jobsLink;
};
