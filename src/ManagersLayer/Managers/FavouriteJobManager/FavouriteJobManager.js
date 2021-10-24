"use strict";
const _ = require("lodash");
const uuid = require("uuid");

const FavouriteJob = require("./FavouriteJob");

// Managers
const JobManager = require("/opt/JobsManager");

class FavouriteJobManager {
  /**
   * Creates a new Favourite Job Record
   *
   * @param {String} userId User ID
   * @param {String} jobId New favourite job ID
   */
  addToFavourites(userId, jobId) {
    return new Promise((resolve, reject) => {
      const newRecord = new FavouriteJob({
        _id: uuid.v4(),
        userId,
        jobId
      });

      newRecord.save(err => {
        if (err) return reject(err);

        resolve(newRecord);
      });
    });
  }

  /**
   * Deletes a Favourite Job Record
   *
   * @param {String} favouriteJobId favourite job ID
   */
  deleteFromFavourite(favouriteJobId) {
    return new Promise((resolve, reject) => {
      FavouriteJob.delete({ _id: favouriteJobId }, err => {
        if (err) return reject(err);

        resolve();
      });
    });
  }

  /**
   * Returns user's favourites jobs list (just ID's)
   * @param {String} userId User ID
   *
   * @returns {Array} Array of user's favourites jobs
   */
  getUsersFavouriteJobs(userId) {
    return new Promise((resolve, reject) => {
      const filter = { userId: { eq: userId } };

      FavouriteJob.scan(filter).exec((err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  /**
   * Returns user's favourites jobs list (just ID's)
   * @param {String} userId User ID
   *
   * @returns {Array} Array of user's favourites jobs
   */
  getFavouritesByJobId(jobId) {
    return new Promise((resolve, reject) => {
      const filter = { jobId: { eq: jobId } };

      FavouriteJob.scan(filter).exec((err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  /**
   * Returns user's favourites jobs list (with full job object)
   *
   * @param {String} userId User ID
   *
   * @returns {Array} Array of user's favourites jobs
   * @param {User} user Cognito User object
   */
  async getFullFavouritesJobList(userId, user = null) {
    const manager = new FavouriteJobManager();

    const userFavouriteJobs = await manager.getUsersFavouriteJobs(userId);

    const jobPromises = userFavouriteJobs.map(({ jobId, _id }) =>
      JobManager.getFullJobById(jobId, user, {}, true)
        .then(job => {
          return _.assign(job, { favouriteId: _id });
        })
        .catch(err => {
          console.log("getFullFavouritesJobList err", err);

          return null;
        })
    );

    const favouriteJobList = await Promise.all(jobPromises);

    return _.compact(favouriteJobList);
  }

  /**
   * Find favourite job
   *
   * @param {string} userId User's ID
   * @param {string} jobId Job's ID
   *
   * @returns Job or null
   */
  findFavouriteJob(userId, jobId) {
    return new Promise((resolve, reject) => {
      const filter = {
        userId: {
          eq: userId
        },
        jobId: {
          eq: jobId
        }
      };

      FavouriteJob.scan(filter, (err, data) => {
        if (err) return reject(err);

        resolve(data[0] || null);
      });
    });
  }

  async deleteUsersFavouriteJobs(userId) {
    const favList = await this.getUsersFavouriteJobs(userId);

    favList.forEach(fav => {
      this.deleteFromFavourite(fav._id);
    });
  }

  async deleteJobFromAllFavourites(jobId) {
    const favList = await this.getFavouritesByJobId(jobId);

    (favList || []).forEach(fav => {
      this.deleteFromFavourite(fav._id);
    });
  }
}

module.exports = FavouriteJobManager;
