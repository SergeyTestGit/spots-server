const moment = require("moment");

const getJobsLink = require("./getJobsLink");

module.exports = (job, withAddress = false) => {
  if (!job) return null;

  let jobsTitle = job.title;

  if (withAddress) {
    const time = moment(job.startDate).format("dddd, MMMM Do YYYY, h:mm A");
    const address = `:  ${time} @ ${job.streetAddress} ${job.city} ${job.state} ${job.zipCode}`;

    jobsTitle += address;
  }

  const jobsLink = getJobsLink(job);

  return `<a href="${jobsLink}">${jobsTitle}</a>`;
};
