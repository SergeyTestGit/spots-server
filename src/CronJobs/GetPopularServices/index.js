const _ = require("lodash");

module.exports.handler = async (event, context, callback) => {
  try {
    // Managers
    const JobsManager = require("/opt/JobsManager");
    const ServicesManager = require("/opt/ServicesManager");

    const jobs = await JobsManager.getJobList();
    const groupedJobs = _.groupBy(jobs, job => job.category);

    const services = await ServicesManager.getServicesList();

    const ordered = _.orderBy(
      services,
      service => (groupedJobs[service._id] || []).length,
      "desc"
    );

    const top = _.take(ordered, 10).map((service, index) => ({
      popularity: index + 1,
      categoryId: service._id
    }));

    await ServicesManager.setPopularServices(top);
  } catch (error) {
    console.log("popular services cron error", error);

    callback(error);
  }
};
