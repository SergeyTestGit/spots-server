const _ = require("lodash");

const JobModel = require("../Models/Job.model");

const jobStatus = require("../Constants/jobStatus");

class JobManager {
  /**
   * Get booked jobs for user
   *
   * @param {String} userId User ID
   *
   * @returns {Array} List of booked jobs
   */
  getUsersJobs(userId) {
    return new Promise((resolve, reject) => {
      // const filter = {
      //   FilterExpression: `author = :userId and jobStatus <> :statusDone and jobStatus <> :statusCanceled`,
      //   ExpressionAttributeValues: {
      //     ":userId": userId,
      //     ":statusCanceled": jobStatus.canceled,
      //     ":statusDone": jobStatus.done
      //   }
      // };

      JobModel.scan().exec((err, data) => {
        if (err) return reject(err);

        const usersJobs = {
          posted: [],
          booked: []
        };

        data.forEach(job => {
          if (job.author === userId) {
            usersJobs.posted.push(job);
          } else if (job.doer === userId) {
            usersJobs.booked.push(job);
          }
        });

        resolve(usersJobs);
      });
    });
  }

  getJobListByIds(idList) {
    return new Promise((resolve, reject) => {
      JobModel.scan("_id")
        .in(idList || [])
        .exec((err, data) => {
          if (err) return reject;

          resolve(data);
        });
    });
  }

  async getJobById(jobId) {
    const jobRef = await JobModel.get({ _id: jobId });

    return jobRef;
  }

  getUsersBookedJobs(userId) {
    return new Promise((resolve, reject) => {
      JobModel.scan("author")
        .eq(userId)
        .and()
        .where("jobStatus")
        .eq(jobStatus.booked)
        .exec((err, data) => {
          if (err) return reject(err);

          resolve(data);
        });
    });
  }
}

module.exports = new JobManager();
module.exports.JobManager = JobManager;
