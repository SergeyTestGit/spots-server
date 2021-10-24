const { NODE_ENV } = process.env;
const _ = require("lodash");
const uuid = require("uuid");

const JobRequest = require("./JobRequest");

const ApplyJobManager = require(NODE_ENV === 'test' ? "../ApplyJobManager" : "/opt/ApplyJobManager");
const JobManager = require(NODE_ENV === 'test' ? "../JobsManager" : "/opt/JobsManager");
const UserManager = require(NODE_ENV === 'test' ? "../UserManager" : "/opt/UserManager");
const FavouriteSPManager = require(NODE_ENV === 'test' ? "../FavouriteSPManager" : "/opt/FavouriteSPManager");
const NotificationsManager = require(NODE_ENV === 'test' ? "../NotificationsManager" : "/opt/NotificationsManager");

const jobApplicationStatus = require(NODE_ENV === 'test' ? "../../../../shared/nodejs/Constants/jobApplicationStatus" : "/opt/nodejs/Constants/jobApplicationStatus");
const NotificationType = require(NODE_ENV === 'test' ? "../../../../shared/nodejs/Constants/NotificationType" : "/opt/nodejs/Constants/NotificationType");

class JobRequestManager {
  /**
   * Creates a new Job Request
   *
   * @param {Object} jobRequestData Job Request Data
   *
   * @returns new Job Request
   */
  createJobRequest(jobRequestData, event) {
    return new Promise((resolve, reject) => {
      ApplyJobManager.checkUserAppliedForJob(
        jobRequestData.doer,
        jobRequestData.job
      ).then(isUserApplied => {
        if (isUserApplied) {
          reject({
            code: "UserAlreadyApplied",
            message: "User already applied for the job"
          });

          return;
        }

        const newJobRequestData = _.assign(jobRequestData, { _id: uuid.v4() });

        const newJobRequest = new JobRequest(newJobRequestData);

        newJobRequest.save(err => {
          if (err) return reject(err);

          resolve(newJobRequest);

          NotificationsManager.sendNotification(
            jobRequestData.doer,
            NotificationType.newJobRequest,
            {
              jobId: newJobRequest.job,
              userId: newJobRequest.doer
            },
            event
          ).catch();
        });
      });
    });
  }

  async sendJobRequest(jobRequestData, event, author) {
    if (!author.isPremium) {
      const existingJobRequests = await this.getJobRequestsForJob(
        jobRequestData.job
      );

      if ((existingJobRequests || []).length === 5) {
        throw {
          code: "JobRequestCountOverflow",
          message: "Free users can send only 5 job requests per job"
        };
      }
    }

    return await this.createJobRequest(jobRequestData, event);
  }

  /**
   * Get Job Requests for some job
   *
   * @param {String} jobId Job ID
   *
   * @returns {Array} Array of job requests
   */
  getJobRequestsForJob(jobId) {
    return new Promise((resolve, reject) => {
      const filter = {
        job: { eq: jobId }
      };

      JobRequest.scan(filter, (err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  getUsersRequestsForJob(userId, jobId) {
    return new Promise((resolve, reject) => {
      const filter = {
        FilterExpression: `doer = :userId and job = :jobId`,
        ExpressionAttributeValues: {
          ":userId": userId,
          ":jobId": jobId
        }
      };

      JobRequest.scan(filter, (err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  /**
   * Get users incoming job requests
   *
   * @param {String} userId User ID
   *
   * @returns {Array} Array of Job Requests
   */
  getUsersIncomingJobRequests(userId) {
    return new Promise((resolve, reject) => {
      const filter = {
        doer: { eq: userId }
      };

      JobRequest.scan(filter, (err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  /**
   * Get users outgoing job requests
   *
   * @param {String} userId User ID
   *
   * @returns {Array} Array of Job Requests
   */
  getUsersOutgoingJobRequests(userId) {
    return new Promise((resolve, reject) => {
      const filter = {
        employer: { eq: userId }
      };

      JobRequest.scan(filter, (err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  /**
   * Get users incoming job requests with job
   *
   * @param {String} userId User ID
   *
   * @returns {Array} Array of Job Requests with job
   */
  async getUsersIncomingJobRequestsWithJobs(userId) {
    const manager = new JobRequestManager();

    const jobRequests = await manager.getUsersIncomingJobRequests(userId);

    const promises = jobRequests.map(async jobRequest => {
      try {
        const job = await JobManager.getFullJobById(jobRequest.job);

        return _.assign(job, { jobRequest });
      } catch (er) {
        return null;
      }
    });

    const fullJobRequests = await Promise.all(promises);

    return _.compact(fullJobRequests);
  }

  /**
   * Get users outgoing job requests with job
   *
   * @param {String} userId User ID
   *
   * @returns {Array} Array of Job Requests with job
   */
  async getUsersOutgoingJobRequestsWithJobs(userId) {
    const manager = new JobRequestManager();

    const jobRequests = await manager.getUsersOutgoingJobRequests(userId);

    const usersFavouriteSps = await FavouriteSPManager.getUsersFavouriteSPs(
      userId
    );

    const promises = jobRequests.map(async jobRequest => {
      try {
        const job = await JobManager.getFullJobById(jobRequest.job);

        const doer = await UserManager.getFullUser(
          {
            username: jobRequest.doer
          },
          {
            populate: true
          }
        );

        const fav = _.find(
          usersFavouriteSps,
          sp => sp.spId === jobRequest.doer
        );

        return _.assign(job || {}, {
          jobRequest,
          doer: _.assign(doer, {
            favouriteId: fav ? fav._id : null
          })
        });
      } catch (er) {
        return null;
      }
    });

    const fullJobRequests = await Promise.all(promises);

    return _.compact(fullJobRequests);
  }

  /**
   * Get job request by ID
   *
   * @param {String} jobRequestId Job Request ID
   *
   * @returns Job Request
   */
  async getJobRequestById(jobRequestId) {
    const jobRequest = await JobRequest.get({ _id: jobRequestId });

    return jobRequest;
  }

  /**
   * Deletes a job request
   *
   * @param {String} jobRequestId Application ID
   */
  deleteJobRequest(jobRequestId) {
    return new Promise((resolve, reject) => {
      JobRequest.delete({ _id: jobRequestId }, err => {
        if (err) return reject(err);

        resolve();
      });
    });
  }

  /**
   * Delete all job requests for a job
   *
   * @param {String} jobId Job ID
   */
  async deleteJobRequestsForJob(jobId) {
    const jobRequests = await this.getJobRequestsForJob(jobId);

    const promises = (jobRequests || []).map(async jobRequest => {
      await this.deleteJobRequest(jobRequest._id);
    });

    await Promise.all(promises);
  }

  /**
   * Accept job request
   *
   * @param {String} jobRequestId Job Request ID
   *
   * @returns new application
   */
  async acceptJobRequest(jobRequestId, event) {
    console.log("acceptJobRequest", jobRequestId);
    const jobRequest = await this.getJobRequestById(jobRequestId);

    if (!jobRequest) {
      throw {
        code: "InvalidJobRequestId",
        message: "Such Job Request Doesnt Exist"
      };
    }

    const newJobApply = {
      userId: jobRequest.doer,
      jobId: jobRequest.job,
      status: jobApplicationStatus.accepted,
      suggestedStartDate: jobRequest.suggestedStartDate,
      suggestedBudget: jobRequest.suggestedBudget
    };

    await this.deleteJobRequest(jobRequest._id);

    const newApply = await ApplyJobManager.applyForJob(newJobApply);

    NotificationsManager.sendNotification(
      jobRequest.employer,
      NotificationType.jobRequestAccepted,
      {
        jobId: jobRequest.job,
        userId: jobRequest.doer
      },
      event
    ).catch();

    return newApply;
  }

  /**
   * Reject job request
   *
   * @param {String} jobRequestId Job Request ID
   */
  async rejectJobRequest(jobRequestId, event) {
    const jobRequest = await this.getJobRequestById(jobRequestId);

    NotificationsManager.sendNotification(
      jobRequest.employer,
      NotificationType.jobRequestRejected,
      {
        jobId: jobRequest.job,
        userId: jobRequest.doer
      },
      event
    ).catch();

    await this.deleteJobRequest(jobRequestId);
  }

  async deleteUsersJobRequests(userId) {
    const manager = new JobRequestManager();

    const incoming = await manager.getUsersIncomingJobRequests(userId);
    const outgoing = await manager.getUsersOutgoingJobRequests(userId);

    (incoming || []).forEach(req => {
      this.deleteJobRequest(req._id);
    });
    (outgoing || []).forEach(req => {
      this.deleteJobRequest(req._id);
    });
  }

  async deleteJobRequestsForJob(jobId) {
    const requests = await this.getJobRequestsForJob(jobId);

    requests.forEach(req => {
      this.deleteJobRequest(req._id);
    });
  }
}

module.exports = JobRequestManager;
