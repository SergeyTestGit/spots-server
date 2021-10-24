"use strict";
const { NODE_ENV } = process.env;
const _ = require("lodash");

// Managers
const UserCognitoManager = require(NODE_ENV === 'test' ? "../UserCognitoManager" : "/opt/UserCognitoManager");
const UserDynamoDBManager = require(NODE_ENV === 'test' ? "../UserDynamoDBManager" : "/opt/UserDynamoDBManager");
const ServicesManager = require(NODE_ENV === 'test' ? "../ServicesManager" : "/opt/ServicesManager");
const TransactionManager = require(NODE_ENV === 'test' ? "../TransactionsManager" : "/opt/TransactionsManager");
const SubscriptionsManager = require(NODE_ENV === 'test' ? "../SubscriptionsManager" : "/opt/SubscriptionsManager");

// Constants
const {
  userAttribProviders,
  userFields
} = require(NODE_ENV === 'test' ? "../../../../shared/nodejs/Constants/userAttributesProviders" : "/opt/nodejs/Constants/userAttributesProviders");

class UserManager {
  /**
   * Returns full user inlcuding Cognito and DynamoDB attributes
   *
   * @param {object} identifier user identifier: one of ``{ accessToken, username }``
   * @param options additional options
   */
  async getFullUser(identifier, options = {}) {
    const cognitoUser =
      options.cognitoUser ||
      (await UserCognitoManager.getCognitoUser(
        identifier,
        options.forceCongnito
      ));

    const dynamoUserAttributes =
      options.dynamoUserAttributes ||
      (await UserDynamoDBManager.getDynamoUserAttributes(cognitoUser.username));

    let fullUser = _.assign(cognitoUser, dynamoUserAttributes);

    if (options.populate) {
      fullUser = await this.populateUserAttributes(fullUser);
    }

    return fullUser;
  }

  /**
   * Creates new user
   *
   * @param {String} username Cognito username
   * @param {String} password Cognito password
   * @param {Object} user User attributes
   * @param {Object} options Additional options
   *
   * @returns Full user
   */
  async createNewUser(username, password, user, options) {
    const [
      userExists,
      existingUsersList
    ] = await UserCognitoManager.checkCognitoUserExists({
      username,
      email: user.email,
      phoneNumber: user.phoneNumber
    });

    if (userExists) {
      const existingUser = existingUsersList[0];

      throw {
        message: existingUser.authProvider || "UserExistsException",
        existingUser
      };
    }

    const userAttribs = this.getRawUserAttrributes({
      ...(user || {}),
      account_status: "enabled",
      settings_notif: true,
      settings_job_allerts: true,
      isPremium: false,
      rate: 0
    });

    const {
      CodeDeliveryDetails
    } = await UserCognitoManager.createNewCognitoUser(
      username,
      password,
      _.get(userAttribs, "cognitoAttribs.updated", []),
      options
    );
    await UserDynamoDBManager.createNewDynamoUser(
      userAttribs.dynamoAttribs,
      options
    );

    const fullNewUser = await this.getFullUser(
      { username },
      { populate: true }
    );

    return [fullNewUser, CodeDeliveryDetails];
  }

  /**
   * Search for existing user. If user not exist will create a new user.
   *
   * @param {object} identifier @param {object} identifier user identifier: one of ``{ accessToken, username }``
   * @param {object} newUserData New user data
   * @param {object} options Options
   *
   * @returns {User} Full new user
   */
  async findOrCreate(identifier, newUserData, options = {}) {
    try {
      return [await this.getFullUser(identifier, options), false];
    } catch (error) {
      if (error.code !== "UserNotFoundException") {
        console.log(error);

        throw error;
      }

      const { username, password, user } = newUserData;

      const newUser = await this.createNewUser(
        username,
        password,
        user,
        options
      );

      return [newUser, true];
    }
  }

  /**
   * Updates user fields for both - Cognito and DynamoDB
   *
   * @param {Object} update User updates object
   * @param {string} userId User's to update ID
   * @param {object} identifier user identifier: one of ``{ accessToken, username }``
   */
  async updateUser(update, userId, identifier) {
    const processedUpdates = _.clone(update);

    if (_.isArray(update.idPics)) {
      processedUpdates.idPics = _.join(update.idPics, "|");
    }

    const {
      cognitoAttribs: cognitoUpdate,
      dynamoAttribs: dynamoUpdates
    } = this.getRawUserAttrributes(processedUpdates);

    const response = {};

    if (!_.isEmpty(dynamoUpdates)) {
      response.dynamo = await UserDynamoDBManager.updateDynamoUser(
        userId,
        dynamoUpdates
      );
    }

    response.cognito = await UserCognitoManager.updateCognitoUser(
      cognitoUpdate,
      identifier
    );

    return response;
  }

  /**
   * Populates user object with profile images links and services
   *
   * @param {Object} user Full user object
   */
  async populateUserAttributes(user) {
    const nextUser = _.cloneDeep(user);

    const servicesList = await ServicesManager.getServicesList();

    if (_.isArray(user.services)) {
      nextUser.services = user.services.map(userService => {
        let service =
          _.find(servicesList, item => item._id === userService.categoryId) ||
          {};

        if (service.subservices && userService.serviceId) {
          service =
            _.find(
              service.subservices,
              item => item._id === userService.serviceId
            ) || {};
        }

        return _.assign(service, userService);
      });
    }
    const userPtsData = await TransactionManager.getUsersPtsAmountWithExpiryDate(
      nextUser.username
    );

    nextUser.ptsAmount = userPtsData.ptsAmount;
    nextUser.ptsExpirationDate = userPtsData.expirationDate;

    nextUser.activeSubscription = await SubscriptionsManager.getUsersActiveSubscription(
      nextUser.username
    );

    return nextUser;
  }

  /**
   * Converts user object to raw DynamoDB and Cognito attributes
   *
   * @param {User} userObject
   *
   * @returns {Object} ``{ dynamoAttribs, cognitoAttribs }``\
   * `dynamoAttribs` - object of DynamoDB attributes `{ Name: Value }`\
   * `cognitoAttribs` - array of raw cognito attributes `{ Name: 'name', Value: 'value' }`
   */
  getRawUserAttrributes(userObject) {
    const dynamoAttribs = {};
    const cognitoAttribs = {
      updated: [],
      deleted: []
    };

    Object.keys(userObject).forEach(key => {
      const fieldInfo = userFields[key];

      if (!fieldInfo || userObject[key] === undefined) return;

      const val = fieldInfo.process
        ? fieldInfo.process(userObject[key])
        : userObject[key];

      if (fieldInfo.provider === userAttribProviders.cognito) {
        if (userObject[key] === null) {
          cognitoAttribs.deleted.push(fieldInfo.providerField);
        } else {
          cognitoAttribs.updated.push({
            Name: fieldInfo.providerField,
            Value: val
          });
        }
      } else if (fieldInfo.provider === userAttribProviders.dynamo) {
        dynamoAttribs[fieldInfo.providerField] = val;
      }
    });

    return {
      cognitoAttribs,
      dynamoAttribs
    };
  }
}

module.exports = UserManager;
