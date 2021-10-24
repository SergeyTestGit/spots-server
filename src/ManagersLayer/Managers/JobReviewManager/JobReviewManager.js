const { NODE_ENV } = process.env;
const _ = require("lodash");
const uuid = require("uuid");

const UserManager = require(NODE_ENV === 'test' ? "../UserManager" : "/opt/UserManager");

const JobReview = require("./JobReview");

class JobReviewManager {
  /**
   * Creates a new review
   *
   * @param {Object} reviewData Review data
   *
   * @returns {JobReview} new job review
   */
  createReview(reviewData) {
    return new Promise((resolve, reject) => {
      const newReviewData = _.assign(reviewData, {
        _id: uuid.v4()
      });

      const newReview = new JobReview(newReviewData);

      newReview.save(err => {
        if (err) {
          return reject(err);
        }

        this.updateUserRate(reviewData.reviewedUserId);

        resolve(newReview);
      });
    });
  }

  /**
   * Update a job review
   *
   * @param {String} reviewId Review ID
   * @param {Object} update Update object
   *
   * @returns {JobReview} Next Job Review
   */
  async updateReview(reviewId, update) {
    const nextReview = await JobReview.update({ _id: reviewId }, update);

    console.log("updateReview nextReview", nextReview);

    this.updateUserRate(nextReview.reviewedUserId);

    return nextReview;
  }

  /**
   * Delete a Job Review
   *
   * @param {String} reviewId Job Review ID
   */
  deleteReview(reviewId) {
    return new Promise((resolve, reject) => {
      JobReview.delete({ _id: reviewId }, err => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  /**
   * Get reviews list for user
   *
   * @param {String} userId User ID
   *
   * @returns {Array} Array of reviews
   */
  getReviewsForUser(userId) {
    return new Promise((resolve, reject) => {
      const filter = {
        reviewedUserId: {
          eq: userId
        }
      };

      JobReview.scan(filter).exec((err, data) => {
        if (err) {
          return reject(err);
        }

        resolve(data);
      });
    });
  }

  async getReviewById(reviewId) {
    return await JobReview.get({ _id: reviewId });
  }

  /**
   * Get full reviews list for user
   *
   * @param {String} userId User ID
   *
   * @returns {Array} Array of reviews
   */
  async getFullReviewsForUser(userId) {
    const reviews = await this.getReviewsForUser(userId);

    const promises = reviews.map(review =>
      UserManager.getFullUser(
        { username: review.author },
        { populate: true }
      ).then(authorData => {
        console.log("authorData", authorData);

        const author = {
          avatarURL: authorData.avatarURL || null,
          given_name: authorData.given_name,
          family_name: authorData.family_name,
          isPro: authorData.isPro || false,
          isVerified: authorData.isVerified || false,
          isPremium: authorData.isPremium || false,
          username: authorData.username,
          stars: authorData.rate || 0,
          services: (authorData.services || []).filter(
            service => service.status === "active"
          )
        };

        return _.assign(review, { author });
      })
    );

    const fullReviews = await Promise.all(promises);

    return fullReviews;
  }

  /**
   * Get reviews created by user
   *
   * @param {String} userId User ID
   *
   * @returns {Array} Array of reviews
   */
  getReviewsCreatedByUser(userId) {
    return new Promise((resolve, reject) => {
      const filter = {
        author: {
          eq: userId
        }
      };

      JobReview.scan(filter).exec((err, data) => {
        if (err) {
          return reject(err);
        }

        resolve(data);
      });
    });
  }

  /**
   * Calculate User's rate based on review rates
   *
   * @param {String} userId User ID
   *
   * @returns {Number} User Rate
   */
  async calcUserRate(userId) {
    const reviews = await this.getReviewsForUser(userId);

    const avgRate = _.meanBy(reviews, review => _.get(review, "rate", 0));

    return avgRate;
  }

  /**
   * Update User's rate
   *
   * @param {String} userId User ID
   */
  async updateUserRate(userId) {
    const userRate = await this.calcUserRate(userId);

    const update = {
      rate: _.round(userRate, 2)
    };

    await UserManager.updateUser(update, userId, { username: userId });
  }

  getUsersReivewForUser(authorId, reviewedUserId) {
    return new Promise((resolve, reject) => {
      const filter = {
        FilterExpression: `author = :authorId and reviewedUserId = :reviewedUserId`,
        ExpressionAttributeValues: {
          ":authorId": authorId,
          ":reviewedUserId": reviewedUserId
        }
      };

      JobReview.scan(filter).exec((err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  getReviewsByJobId(jobId) {
    return new Promise((resolve, reject) => {
      JobReview.scan("jobId")
        .eq(jobId)
        .exec((err, data) => {
          if (err) return reject(err);

          resolve(data);
        });
    });
  }
}

module.exports = JobReviewManager;
