"use strict";
const { NODE_ENV } = process.env;
const _ = require("lodash");
const uuid = require("uuid");

const ApplyForJob = require("./ApplyForJob");

const UserManager = require(NODE_ENV === 'test' ? "../UserManager" : "/opt/UserManager");
const JobManager = require(NODE_ENV === 'test' ? "../JobsManager" : "/opt/JobsManager");
const NotificationsManager = require(NODE_ENV === 'test' ? "../NotificationsManager" : "/opt/NotificationsManager");

const jobApplicationStatus = require(NODE_ENV === 'test' ? "../../../../shared/nodejs/Constants/jobApplicationStatus" : "/opt/nodejs/Constants/jobApplicationStatus");
const NotificationType = require(NODE_ENV === 'test' ? "../../../../shared/nodejs/Constants/NotificationType" : "/opt/nodejs/Constants/NotificationType");

class ApplyForJobManager {
  /**
   * Check if user applied for specific job
   *
   * @param {String} userId User ID
   * @param {String} jobId Job ID
   *
   * @returns {Boolean} Boolean Flag
   */
  checkUserAppliedForJob(userId, jobId, returnApplications = false) {
    return new Promise((resolve, reject) => {
      const filter = {
        jobId: { eq: jobId },
        userId: { eq: userId }
      };

      ApplyForJob.scan(filter, (err, data) => {
        if (err) return reject(err);

        if (returnApplications) {
          resolve(data[0]);
        } else {
          resolve(data.length > 0);
        }
      });
    });
  }

  /**
   * Get user's applications
   *
   * @param {String} userId User ID
   *
   * @returns {Array} Array of applications
   */
  getUsersApplications(userId) {
    return new Promise((resolve, reject) => {
      const filter = {
        userId: { eq: userId }
      };

      ApplyForJob.scan(filter, (err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  /**
   * Get user's applications with jobs
   *
   * @param {String} userId User ID
   *
   * @returns {Array} Array of applications with job
   */
  async getUsersApplicationsWithJobs(userId) {
    const manager = new ApplyForJobManager();

    const applications = await manager.getUsersApplications(userId);

    const promises = applications.map(application => {
      return JobManager.getFullJobById(application.jobId)
        .then(job => {
          return _.assign(job, { application });
        })
        .catch(err => {
          console.log(application, err);
          return null;
        });
    });

    const fullApplications = await Promise.all(promises);

    console.log("fullApplications", fullApplications);

    return _.compact(fullApplications);
  }

  /**
   * Get Application from DynamoDB
   *
   * @param {String} applicationId Application ID
   */
  async getApplicationById(applicationId) {
    const application = await ApplyForJob.get({ _id: applicationId });

    return application;
  }

  /**
   * Apply for a job
   *
   * @param {String} application application object
   *  Fields:
   *    - `userId` - user who applies ID
   *    - `jobId` - job user applies for ID
   *    - ?`suggestedDate` - date suggested by user
   *
   * @returns {Object} new application
   */
  async applyForJob(application, event) {
    const JobRequestsManager = require("/opt/JobRequestManager");
    const JobManager = require("/opt/JobsManager");

    const existingJob = await JobManager.getJobById(application.jobId);

    if (!existingJob) {
      throw {
        code: "JobDoesntExist",
        message: "Job with such id doesn't exists"
      };
    }

    const usersRequestsForJob = await JobRequestsManager.getUsersRequestsForJob(
      application.userId,
      application.jobId
    );

    if (usersRequestsForJob.length) {
      throw {
        code: "UserAlreadyHasJobRequest",
        message: "User already has request for the job"
      };
    }

    const userAlreadyApplied = await this.checkUserAppliedForJob(
      application.userId,
      application.jobId
    );

    if (userAlreadyApplied) {
      throw {
        code: "UserAlreadyApplied",
        message: "User already applied"
      };
    }

    const newApplication = await this.createApplication(application);

    if (event) {
      NotificationsManager.sendNotification(
        existingJob.author,
        NotificationType.appliedForJob,
        {
          userId: application.userId,
          jobId: application.jobId
        },
        event
      ).catch(err => console.error(err));
    }

    return newApplication;
  }

  /**
   * Creates new application for a job
   *
   * @param {String} application application object
   *  Fields:
   *    - `userId` - user who applies ID
   *    - `jobId` - job user applies for ID
   *    - ?`suggestedDate` - date suggested by user
   *
   * @returns {Object} new application
   */
  createApplication(application) {
    return new Promise((resolve, reject) => {
      application._id = uuid.v4();
      const newApplication = new ApplyForJob(application);

      newApplication.save(err => {
        if (err) return reject(err);

        resolve(newApplication);
      });
    });
  }

  /**
   * Deletes an application
   *
   * @param {String} applicationId Application ID
   */
  deleteApplication(applicationId) {
    return new Promise((resolve, reject) => {
      ApplyForJob.delete({ _id: applicationId }, err => {
        if (err) return reject(err);

        resolve();
      });
    });
  }

  /**
   * Rejects an application
   *
   * @param {String} applicationId Application ID
   */
  async rejectApplication(applicationId, event) {
    const application = await this.getApplicationById(applicationId);

    const existingJob = await JobManager.getJobById(application.jobId);

    const res = await this.deleteApplication(applicationId);

    NotificationsManager.sendNotification(
      existingJob.userId,
      NotificationType.jobRequestRejected,
      {
        jobId: application.jobId,
        userId: existingJob.author
      },
      event
    ).catch();

    return res;
  }

  /**
   * Accepts an application
   *
   * @param {String} applicationId
   */
  async acceptApplication(applicationId, event) {
    const update = {
      status: jobApplicationStatus.accepted
    };

    const nextApplication = await this.updateApplication(applicationId, update);

    const existingJob = await JobManager.getJobById(nextApplication.jobId);

    NotificationsManager.sendNotification(
      nextApplication.userId,
      NotificationType.jobRequestAccepted,
      {
        jobId: nextApplication.jobId,
        userId: existingJob.author
      },
      event
    ).catch();

    return nextApplication;
  }

  /**
   * Updates application
   *
   * @param {String} applicationId Application to update ID
   * @param {object} update Updates
   *
   * @returns {object} Updated application
   */
  updateApplication(applicationId, update) {
    return new Promise((resolve, reject) => {
      ApplyForJob.update({ _id: applicationId }, update, (err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  /**
   * Delete all applications for a job
   *
   * @param {String} jobId Job ID
   * @param {String} userNotToSendId User not to send notification to ID
   */
  async deleteApplicationsForJob(
    jobId,
    userNotToSendId,
    event,
    notificationType,
    notificationData
  ) {
    const peopleWhoApplied = await this.getPeopleWhoAppliedList(jobId);

    const promises = (peopleWhoApplied || []).map(async application => {
      if (application.userId !== userNotToSendId) {
        NotificationsManager.sendNotification(
          application.userId,
          notificationType || NotificationType.jobUnavailable,
          notificationData || {
            jobId
          },
          event
        ).catch(err => console.error(err));
      }

      await this.deleteApplication(application._id);
    });

    await Promise.all(promises);
  }

  /**
   * Get list of users applied for a job
   *
   * @param {String} jobId Job ID
   * @param {Object} options Additional options
   *  Possible options:
   *    - `populate` - if true will populate users
   *
   * @returns {Array} array of users applied for a job
   */
  getPeopleWhoAppliedList(jobId, options = {}) {
    return new Promise((resolve, reject) => {
      const filter = {
        jobId: { eq: jobId }
      };

      ApplyForJob.scan(filter, (err, data) => {
        if (err) return reject(err);

        if (!options.populate) return resolve(data);

        const fullApplicationsPromises = data.map(application =>
          UserManager.getFullUser({ username: application.userId })
            .then(user => _.assign(application, { user }))
            .catch(err => {
              console.log("err", err);

              return null;
            })
        );

        Promise.all(fullApplicationsPromises)
          .then(fullApplications => resolve(_.compact(fullApplications)))
          .catch(err => reject(err));
      });
    });
  }

  async deleteUsersApplications(userId) {
    const usersApplications = await this.getUsersApplications(userId);

    usersApplications.forEach(app => {
      this.deleteApplication(app._id);
    });
  }
}

module.exports = ApplyForJobManager;
