"use strict";
const { NODE_ENV } = process.env;
const shortid = require("shortid");
const _ = require("lodash");
const moment = require("moment");

const jobStatus = require(NODE_ENV === 'test' ? "../../../../SocketsServer/Constants/jobStatus" : "/opt/nodejs/Constants/jobStatus");

const NotificationType = require(NODE_ENV === 'test' ? "../../../../shared/nodejs/Constants/NotificationType" : "/opt/nodejs/Constants/NotificationType");

const JobModel = require("./Job");

//Managers
const UserManager = require(NODE_ENV === 'test' ? "../UserManager/UserManager" : "/opt/UserManager");
const ApplyJobManager = require(NODE_ENV === 'test' ? "../ApplyJobManager/ApplyJobManager" : "/opt/ApplyJobManager");
const JobReviewManager = require(NODE_ENV === 'test' ? "../JobReviewManager/JobReviewManager" : "/opt/JobReviewManager");
const JobRequestManager = require(NODE_ENV === 'test' ? "../JobRequestManager/JobRequestsManager" : "/opt/JobRequestManager");
const NotificationsManager = require(NODE_ENV === 'test' ? "../NotificationsManager/NotificationManager" : "/opt/NotificationsManager");
const ServicePorvidersManager = require(NODE_ENV === 'test' ? "../ServiceProvidersManager/ServiceProvidersManager" : "/opt/ServiceProvidersManager");
const ChatManager = require(NODE_ENV === 'test' ? "../ChatManager/ChatManager" : "/opt/ChatManager");

const {
  calcDistanceBetweenUserAndJobWithParams
} = require(NODE_ENV === 'test' ? "../../../HelpersLayer/Helpers/calcDistanceFromCoords" : "/opt/Helpers/calcDistanceFromCoords");
const FilterQueue = require(NODE_ENV === 'test' ? "../../../HelpersLayer/Helpers/Filters/JobFilterQueue" : "/opt/Helpers/Filters/JobFilterQueue");

class JobsManager {
  /**
   * Creates a new Job and puts job's images to S3\
   * Returns new job's object
   * @param {JobObject} jobData New job's data
   */
  createJob(jobData, event) {
    return new Promise(async (resolve, reject) => {
      const processedJobData = _.cloneDeep(jobData);

      if (!processedJobData._id) {
        processedJobData._id = shortid.generate();
      }

      const newJob = new JobModel(processedJobData);

      newJob.save(async err => {
        if (err) return reject(err);

        try {
          const jobGeolocation = newJob.geolocation;
          const sps = await ServicePorvidersManager.getFullServiceProvidersList();

          const filteredByDistanceSps = sps.filter(async ({ username, defaultRadius }) => {
            const { geolocation: userGeolocation } = await UserManager.getFullUser({username});
            const distance = calcDistanceBetweenUserAndJob(userGeolocation, jobGeolocation);
            return defaultRadius > distance;
          });

          filteredByDistanceSps.forEach(SP => {
            console.log("SP: ", SP);
            const spService = _.find(
              SP.services,
              service =>
                (service.categoryId === jobData.category ||
                  service.serviceId === jobData.category) &&
                service.status === "active"
            );

            if (spService && SP.settings_job_allerts) {
              NotificationsManager.sendNotification(
                SP.username,
                NotificationType.jobMatchesProfile,
                {
                  jobId: newJob._id
                },
                event
              ).catch(err => console.error(err));
            }
          });
        } catch (err) {
          console.error(err);
        }
        resolve(this.getJobById(newJob._id));
      });
    });
  }

  /**
   * Returns a job by ID
   * @param {String} jobId Job ID
   */
  async getJobById(jobId) {
    const jobRef = await JobModel.get({ _id: jobId });

    if (!jobRef) return null;

    let jobData = jobRef;

    try {
      jobData = await jobRef.populate({
        path: "category",
        model: "Service"
      });

      if (jobData.service && jobData.category.subservices) {
        const service = _.find(
          jobData.category.subservices,
          service => service._id === jobData.service
        );

        if (service) {
          jobData.service = service;
        }
      }
    } catch (err) {}

    return jobData;
  }

  /**
   * Hire user for job
   *
   * @param {String} jobId Job's ID
   * @param {String} userId User's ID
   * @param {Date} startDate Job Start Date
   */
  async hireUserForJob(jobId, userId, startDate, budget, currency, event) {
    // const FavouriteJobManager = require("/opt/FavouriteJobManager");

    const jobUpdate = {
      jobStatus: jobStatus.booked,
      doer: userId,
      startDate: startDate
    };

    // const jobApplication = await ApplyJobManager.checkUserAppliedForJob(
    //   userId,
    //   jobId,
    //   true
    // );

    if (budget) {
      jobUpdate.budget = budget;
    }
    if (currency) {
      jobUpdate.currency = currency;
    }

    await this.updateJob(jobId, jobUpdate);

    NotificationsManager.sendNotification(
      userId,
      NotificationType.appointmentScheduled,
      {
        jobId,
        userId
      },
      event
    ).catch(err => console.error(err));

    // await ApplyJobManager.deleteApplicationsForJob(jobId, userId, event);
    // await FavouriteJobManager.deleteJobFromAllFavourites(jobId);
    // await JobRequestManager.deleteJobRequestsForJob(jobId);
  }

  /**
   * Returns job including author data
   * @param {String} jobId Job ID
   * @param {User} user Cognito User object
   */
  async getFullJobById(
    jobId,
    user = null,
    queryParams = {},
    checkPermissionForJob = false
  ) {
    const jobData = await this.getJobById(jobId);

    if (!jobData) {
      throw {
        code: "InvalidJobId",
        message: "Job with such ID doesn't exist"
      };
    }

    if (
      ["booked", "done", "completed"].indexOf(jobData.jobStatus) > -1 &&
      checkPermissionForJob
    ) {
      if (
        !user ||
        (user && [jobData.author, jobData.doer].indexOf(user.username) < 0)
      ) {
        throw {
          code: "JobAlreadyBooked",
          message: "Job Already Booked"
        };
      }
    }

    if (moment().isAfter(jobData.doneBefore)) {
      throw {
        code: "ExpiredJob",
        message: "Job Already Expired"
      };
    }

    let author = null;
    let favouriteId = null;

    try {
      const authorData = await UserManager.getFullUser(
        {
          username: jobData.author
        },
        {
          populate: true
        }
      );

      const reviews =
        (await JobReviewManager.getReviewsForUser(jobData.author)) || [];

      author = {
        avatarURL: authorData.avatarURL || null,
        given_name: authorData.given_name,
        family_name: authorData.family_name,
        isPro: authorData.isPro || false,
        isVerified: authorData.isVerified || false,
        isPremium: authorData.isPremium || false,
        username: authorData.username,
        stars: authorData.rate || 0,
        reviewCount: reviews.length
      };
    } catch (e) {
      console.error(e);
    }

    if (user) {
      jobData.jobRequests = await JobRequestManager.getUsersRequestsForJob(
        user.username,
        jobId
      );

      const FavouriteJobManager = require("../FavouriteJobManager");

      const favJob = await FavouriteJobManager.findFavouriteJob(
        user.username,
        jobId
      );

      if (favJob) {
        favouriteId = favJob._id;
      }

      jobData.distance = calcDistanceBetweenUserAndJobWithParams(
        user,
        jobData,
        queryParams
      );
    }

    jobData.review = await JobReviewManager.getReviewsByJobId(jobData._id);

    const ApplyJobManager = require("/opt/ApplyJobManager");

    const peopleWhoApplied = await ApplyJobManager.getPeopleWhoAppliedList(
      jobId,
      {
        populate: true
      }
    );

    const response = {
      ...jobData,
      favouriteId,
      author,
      peopleWhoApplied
    };

    return response;
  }

  /**
   * Update job
   *
   * @param {String} jobId Job ID
   * @param {Object} update Update object
   *
   * @returns {JobModel} Next Job
   */
  async updateJob(jobId, update) {
    await JobModel.update({ _id: jobId }, update);

    return await this.getFullJobById(jobId);
  }

  /**
   * Delete job
   *
   * @param {String} jobId Job ID
   */
  deleteJob(jobId) {
    return new Promise((resolve, reject) => {
      JobModel.delete({ _id: jobId }, err => {
        if (err) return reject(err);

        ApplyJobManager.deleteApplicationsForJob(jobId, null);

        resolve();
      });
    });
  }

  /**
   * Get jobs list from DynamoDB
   *
   */
  getJobList() {
    return new Promise((resolve, reject) => {
      JobModel.scan().exec((err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  /**
   * Get posted jobs list from DynamoDB
   *
   */
  getPostedJobList() {
    return new Promise((resolve, reject) => {
      const filter = {
        FilterExpression: `jobStatus = :statusPosted and doneBefore > :dateNow`,
        ExpressionAttributeValues: {
          ":statusPosted": jobStatus.posted,
          ":dateNow": Date.now()
        }
      };

      JobModel.scan(filter).exec((err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  /**
   * Returns jobs list filtered with filter
   * @param {FilterQueue} filter Filters object
   * @param {object} user User who search
   */
  async getFilteredJobList(
    filter,
    user = null,
    getJobsFunc = this.getPostedJobList
  ) {
    const JobRequestManager = require("/opt/JobRequestManager");

    if (!filter instanceof FilterQueue) {
      throw Error("Invalid filter queue");
    }

    let favourites = [];
    let applications = [];
    let jobRequests = [];
    let jobIncomingRequests = [];

    if (user) {
      try {
        const FavouriteJobManager = require("/opt/FavouriteJobManager");

        favourites = await FavouriteJobManager.getUsersFavouriteJobs(
          user.username
        );

        const ApplyJobManager = require("/opt/ApplyJobManager");

        applications = await ApplyJobManager.getUsersApplications(
          user.username
        );
        jobRequests = await JobRequestManager.getUsersOutgoingJobRequests(
          user.username
        );
        jobIncomingRequests = await JobRequestManager.getUsersIncomingJobRequests(
          user.username
        );
      } catch (err) {
        console.log(err);
      }
    }

    const jobList = await getJobsFunc(user && user.username);

    const filteredList = await filter.apply(jobList);

    const processedList = filteredList.map(job => {
      const favJob = _.find(favourites, fav => fav.jobId === job._id);
      const application = _.find(
        applications,
        application => application.jobId === job._id
      );
      const requests = _.filter(jobRequests, req => req.job === job._id);
      const incomingRequests = _.filter(
        jobIncomingRequests,
        req => req.job === job._id
      );

      return _.assign(job, {
        favouriteId: favJob ? favJob._id : null,
        applicationId: application ? application._id : null,
        requests,
        incomingRequests
      });
    });

    return processedList;
  }

  /**
   * Cancele a job
   *
   * @param {String} jobId Job to cancele ID
   * @param {String} reason Cancele reason
   *
   * @returns {JobModel} updated job
   */
  async canceleJob(jobId, reason, user, event) {
    const existingJob = await this.getJobById(jobId);

    const update = {
      canceledReason: reason,
      jobStatus: jobStatus.posted,
      doer: null,
      startDate: null
    };

    const updatedJob = await this.updateJob(jobId, update);

    console.log(existingJob.author, existingJob.doer);
    NotificationsManager.sendNotification(
      existingJob.author,
      NotificationType.jobCancelled,
      {
        jobId: updatedJob._id,
        reason
      },
      event
    ).catch(err => console.error(err));
    NotificationsManager.sendNotification(
      existingJob.doer,
      NotificationType.jobCancelled,
      {
        jobId: updatedJob._id,
        reason
      },
      event
    ).catch(err => console.error(err));

    if (updatedJob.author === user.username) {
      await ApplyJobManager.deleteApplicationsForJob(jobId, null, event);
    } else {
      const application = await ApplyJobManager.checkUserAppliedForJob(
        user.username,
        jobId,
        true
      );

      if (application) {
        await ApplyJobManager.deleteApplication(application._id);
      }
    }

    return updatedJob;
  }

  /**
   * Mark job as completed
   *
   * @param {String} jobId Job ID
   * @param {String} userId User who mark ID
   *
   * @returns {JobModel} Updated job
   */
  async markAsCompleted(jobId, userId, event) {
    const job = await this.getJobById(jobId);

    let jobUpdate = null;

    if (userId === job.author) {
      jobUpdate = {
        jobStatus: jobStatus.done,
        endDate: new Date()
      };
    } else if (userId === job.doer) {
      jobUpdate = {
        jobStatus: jobStatus.completed
      };
    }

    if(jobUpdate.jobStatus === jobStatus.done || jobUpdate.jobStatus === jobStatus.completed) {
      console.log("job completed");
      await ChatManager.changeChatStatusToInactive(jobId);
    }

    const appliedUsers = await ApplyJobManager.getPeopleWhoAppliedList(jobId);
    console.log('markAsCompleted - appliedUsers: ', appliedUsers);
    appliedUsers.forEach(appliedUser => {
      if(appliedUser.userId !== job.author) {
        NotificationsManager.sendNotification(
          appliedUser.userId,
          NotificationType.jobUnavailable,
          {
            job
          },
          event
        ).catch(err => console.error(err));
      }
    });

    if (!jobUpdate) {
      throw new Error("Invalid user");
    }

    const updatedJob = await this.updateJob(jobId, jobUpdate);

    return updatedJob;
  }

  /**
   * Get booked jobs for user
   *
   * @param {String} userId User ID
   *
   * @returns {Array} List of booked jobs
   */
  getUsersBookedJobs(userId) {
    return new Promise((resolve, reject) => {
      const filter = {
        FilterExpression: `(author = :userId or doer = :userId) and (jobStatus = :statusBooked or jobStatus = :statusCompleted or jobStatus = :statusDone or jobStatus = :statusCanceled)`,
        ExpressionAttributeValues: {
          ":userId": userId,
          ":statusBooked": jobStatus.booked,
          ":statusCompleted": jobStatus.completed,
          ":statusCanceled": jobStatus.canceled,
          ":statusDone": jobStatus.done
        }
      };

      JobModel.scan(filter).exec((err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  /**
   * Get jobs done by user
   *
   * @param {String} userId User's ID
   *
   * @returns {Array} Array of jobs
   */
  getUsersDoneJobs(userId) {
    return new Promise((resolve, reject) => {
      const filter = {
        FilterExpression: `doer = :userId and jobStatus = :statusDone`,
        ExpressionAttributeValues: {
          ":userId": userId,
          ":statusDone": jobStatus.done
        }
      };

      JobModel.scan(filter).exec((err, data) => {
        if (err) return reject(err);

        console.log({ data, filter });

        resolve(data);
      });
    });
  }

  getUsersJobs(userId) {
    return new Promise((resolve, reject) => {
      const filter = {
        FilterExpression: `author = :userId`,
        ExpressionAttributeValues: {
          ":userId": userId
        }
      };

      JobModel.scan(filter).exec((err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  async deleteUsersJobs(userId) {
    const usersJobs = await this.getUsersJobs(userId);

    usersJobs.forEach(job => {
      this.deleteJob(job._id);
    });
  }

  getJobsStarts45Minutes() {
    return new Promise((resolve, reject) => {
      const now = moment()
        .add({ minutes: 29 })
        .valueOf();
      const startTime = moment()
        .add({ minutes: 46 })
        .valueOf();

      console.log({ startTime });

      const filter = {
        FilterExpression: `(jobStatus = :statusBooked or jobStatus = :statusCompleted or jobStatus = :statusDone) and startDate >= :now and startDate <= :startTime`,
        ExpressionAttributeValues: {
          ":statusBooked": jobStatus.booked,
          ":statusCompleted": jobStatus.completed,
          ":statusDone": jobStatus.done,
          ":startTime": startTime,
          ":now": now
        }
      };

      JobModel.scan(filter).exec((err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }
}

module.exports = JobsManager;
