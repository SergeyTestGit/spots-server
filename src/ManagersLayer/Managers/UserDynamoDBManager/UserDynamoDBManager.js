"use strict";

const UserModel = require("./User");

class UserDynamoDBManager {
  /**
   * Returns user Cognito attributes
   *
   * @param userId user id (default - ``username`` property from Cognito)
   */
  async getDynamoUserAttributes(userId) {
    const user = await UserModel.get({ _id: userId });

    return user;
  }

  /**
   * Create new user in DynamoDB \
   * Returns new User object
   *
   * @param {Object} user User Attributes
   */
  createNewDynamoUser(userParams) {
    return new Promise((resolve, reject) => {
      const newUser = new UserModel(userParams);

      newUser.save(err => {
        if (err) return reject(err);

        resolve(newUser);
      });
    });
  }

  /**
   * Updates User Attributes in DynamoDB\
   * Returns updated user attributes from DynamoDB
   *
   * @param {String} userId User's ID
   * @param {Object} update Users updates
   */
  async updateDynamoUser(userId, update) {
    const response = await UserModel.update({ _id: userId }, update);

    return response;
  }

  /**
   * Delete user
   *
   * @param {String} userId User ID
   */
  deleteUser(userId) {
    return new Promise((resolve, reject) => {
      UserModel.delete({ _id: userId }, err => {
        if (err) return reject(err);

        resolve();
      });
    });
  }
}

module.exports = UserDynamoDBManager;
