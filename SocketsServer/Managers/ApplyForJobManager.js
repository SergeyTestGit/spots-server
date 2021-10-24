const ApplyForJob = require("../Models/ApplyJob.model");

const JobApplicationStatus = require("../Constants/jobApplicationStatus");

class ApplyForJobManager {
  getApplicationsForJobs(jobIds) {
    return new Promise((resolve, reject) => {
      ApplyForJob.scan("jobId")
        .in(jobIds || [])
        .exec((err, data) => {
          if (err) return reject(err);

          resolve(data);
        });
    });
  }

  getUsersApplications(userId) {
    return new Promise((resolve, reject) => {
      ApplyForJob.scan("userId")
        .eq(userId)
        .exec((err, data) => {
          if (err) return reject(err);

          resolve(data);
        });
    });
  }
}

module.exports = new ApplyForJobManager();
module.exports.ApplyForJobManager = ApplyForJobManager;
