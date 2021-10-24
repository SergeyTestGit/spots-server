"use strict";

const shortid = require("shortid");
const _ = require("lodash");

const orderByTypes = require("/opt/nodejs/Constants/orderByTypes");

const JobModel = require("./JobArchive");

// Managers
const UserManager = require("/opt/UserManager");
const JobReviewManager = require("/opt/JobReviewManager");
const FavouriteJobManager = require("/opt/FavouriteJobManager");

const {
  calcDistanceBetweenUserAndJob
} = require("/opt/Helpers/calcDistanceFromCoords");
const FilterQueue = require("/opt/Helpers/Filters/JobFilterQueue");

class JobsArchiveManager {
  /**
   * Creates a new Job and puts job's images to S3\
   * Returns new job's object
   * @param {JobObject} jobData New job's data
   */
  createJob(jobData) {
    return new Promise(async (resolve, reject) => {
      const processedJobData = _.cloneDeep(jobData);

      if (!processedJobData._id) {
        processedJobData._id = shortid.generate();
      }

      const newJob = new JobModel(processedJobData);

      newJob.save(err => {
        if (err) return reject(err);

        resolve(processedJobData);
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

      if (jobData.category && jobData.category.subservices) {
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
   * Returns job including author data
   * @param {String} jobId Job ID
   * @param {User} user Cognito User object
   */
  async getFullJobById(jobId, user = null) {
    const jobData = await this.getJobById(jobId);

    let author = null;
    let favouriteId = null;

    try {
      const authorData = await UserManager.getFullUser({
        username: jobData.author
      });

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
    } catch (e) {}

    if (user) {
      const favJob = await FavouriteJobManager.findFavouriteJob(
        user.username,
        jobId
      );

      if (favJob) {
        favouriteId = favJob._id;
      }

      const distanceM = calcDistanceBetweenUserAndJob(user, jobData);

      if (distanceM) {
        jobData.distanceData = {
          distance: distanceM,
          metric: "metrs"
        };
      }
    }

    const ApplyJobManager = require("./ApplyJobManager");

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
   * Delete job
   *
   * @param {String} jobId Job ID
   */
  deleteJob(jobId) {
    return new Promise((resolve, reject) => {
      JobModel.delete({ _id: jobId }, err => {
        if (err) return reject(err);

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
   * Returns jobs list filtered with filter
   * @param {FilterQueue} filter Filters object
   * @param {object} orderParams order params|
   * @param {object} user User who search
   */
  async getFilteredJobList(filter, orderParams, user = null) {
    if (!filter instanceof FilterQueue) {
      throw Error("Invalid filter queue");
    }

    let favourites = [];

    if (user) {
      try {
        favourites = await FavouriteJobManager.getUsersFavouriteJobs(
          user.username
        );
      } catch (err) {
        console.log(err);
      }
    }

    const jobList = await this.getJobList();

    const filteredList = await filter.apply(jobList);

    const processedList = filteredList.map(job => {
      const favJob = _.find(favourites, fav => fav.jobId === job._id);

      return _.assign(job, {
        favouriteId: favJob ? favJob._id : null
      });
    });

    let orderedList = [];

    switch (orderParams.orderBy) {
      case orderByTypes.new:
        orderedList = _.orderBy(processedList, "createdAt", orderParams.order);
        break;
      case orderByTypes.budget:
        orderedList = _.orderBy(processedList, "budget", orderParams.order);
        break;
      case orderByTypes.distance:
        orderedList = _.orderBy(
          processedList,
          item => _.get(item, "distance.lengthM"),
          orderParams.order
        );
        break;
      case orderByTypes.expiryDate:
        orderedList = _.orderBy(processedList, "expiryDate", orderParams.order);
        break;
      case orderByTypes.doneBefore:
        orderedList = _.orderBy(processedList, "doneBefore", orderParams.order);
        break;
      default:
        orderedList = _.orderBy(processedList, "createdAt", orderParams.order);
        break;
    }

    return orderedList;
  }
}

module.exports = JobsArchiveManager;
