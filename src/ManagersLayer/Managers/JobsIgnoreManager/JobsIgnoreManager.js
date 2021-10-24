"use strict";

const _ = require("lodash");
const uuid = require("uuid");

const JobIgnore = require("./JobIgnore");

class JobIgnoreManager {
  /**
   * Add a new Job Ignore record to DB
   *
   * @param {Object} jobIgnoreData Job Ignore Data
   *
   * @returns {JobIgnore} New Job Ignore Object
   */
  addNewJobIgnore(jobIgnoreData) {
    return new Promise((resolve, reject) => {
      const newJobIgnoreData = _.assign(jobIgnoreData, {
        _id: uuid.v4()
      });

      const newJobIgnore = new JobIgnore(newJobIgnoreData);

      newJobIgnore.save(err => {
        if (err) return reject(err);

        resolve(newJobIgnore);
      });
    });
  }

  /**
   * Remove Job from ignore by JobIgnore ID
   *
   * @param {String} jobIgnoreId JobIgnore ID
   */
  removeJobIgnore(jobIgnoreId, userId) {
    return new Promise((resolve, reject) => {
      JobIgnore.delete({ _id: jobIgnoreId, userId }, err => {
        if (err) return reject(err);

        resolve();
      });
    });
  }

  /**
   * Search for user's ignored jobs
   *
   * @param {String} userId User's ID
   *
   * @returns {Array} Array of ignored jobs
   */
  getUsersIgnoredJobs(userId) {
    return new Promise((resolve, reject) => {
      const filter = {
        userId: {
          eq: userId
        }
      };

      JobIgnore.scan(filter, (err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }
}

module.exports = JobIgnoreManager;
