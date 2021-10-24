const UserReport = require("./UserReport.model");

class UserReportManager {
  /**
   * Create a new user report
   *
   * @param {String} senderId Report sender's ID
   * @param {String} userId User'd ID
   * @param {String} message Message
   *
   * @returns {UserReport} new user report
   */
  createReport(senderId, userId, message) {
    return new Promise((resolve, reject) => {
      const newReportData = {
        senderId,
        userId,
        message
      };

      const newReport = new UserReport(newReportData);

      newReport.save(err => {
        if (err) return reject(err);

        resolve(newReport);
      });
    });
  }
}

module.exports = UserReportManager;
