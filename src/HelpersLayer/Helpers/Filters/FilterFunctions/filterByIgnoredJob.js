const _ = require("lodash");

const filterByIgnoredJob = (job, filterData, user) => {
  const indexOfIgnoredList = _.findIndex(
    filterData,
    ignore => ignore.jobId === job._id
  );

  if (indexOfIgnoredList > -1) {
    return null;
  }

  return job;
};

module.exports = filterByIgnoredJob;
