"use strict";

const _ = require("lodash");

const { cognitoIdentityServiceProvider } = require("../CognitoManager");

class UserCognitoManager {
  /**
   * Returns user Cognito attributes
   *
   * @param {object} identifier user identifier: one of ``{ accessToken, username }``
   */
  getCognitoUser(identifier, force = false) {
    const thisRef = this;

    return new Promise(function(resolve, reject) {
      if (!identifier) {
        return reject("No identifier provided");
      }

      const callback = (err, data) => {
        if (err) {
          reject(err);
        } else {
          try {
            const userObject = thisRef.parseCognitoUserAttributes(data);

            if (userObject.account_status === "disabled" && !force) {
              reject({
                code: "UserIsDisabled",
                message: "User is disabled"
              });
            }

            userObject.idPics = userObject.idPics
              ? _.split(userObject.idPics, "|")
              : [];

            userObject.isProvider = userObject.isProvider === "1";
            userObject.isPro = userObject.isPro === "1";
            userObject.isAgreedWithTerms = userObject.isAgreedWithTerms === "1";
            userObject.settings_job_allerts =
              userObject.settings_job_allerts === "1";
            userObject.settings_notif = userObject.settings_notif === "1";
            userObject.isPremium = userObject.isPremium === "1";

            resolve(userObject);
          } catch (error) {
            reject(error);
          }
        }
      };

      const { accessToken, username } = identifier;

      if (accessToken) {
        const params = {
          AccessToken: accessToken
        };

        cognitoIdentityServiceProvider.getUser(params, callback);
      } else if (username) {
        const params = {
          UserPoolId: process.env.UserPoolId,
          Username: username
        };

        cognitoIdentityServiceProvider.adminGetUser(params, callback);
      } else {
        reject("No identifier provided");
      }
    });
  }

  /**
   * Creates new Congtion User and puts all attrbutes
   *
   * @param {String} Username
   * @param {String} Password
   * @param {Array} UserAttributes Array of user attributes ``{ Name: '', Value: '' }``
   * @param {Object} options Additional options
   *
   * @returns Cognito create user response
   */
  createNewCognitoUser(Username, Password, UserAttributes, options = {}) {
    return new Promise((resolve, reject) => {
      const cb = (err, data) => {
        console.log("err", err);
        if (err) return reject(err);

        const updateParams = {
          UserPoolId: process.env.UserPoolId,
          Username,
          UserAttributes
        };

        cognitoIdentityServiceProvider.adminUpdateUserAttributes(
          updateParams,
          err => {
            console.log("err1", err);
            if (err) return reject(err);

            resolve(data);
          }
        );
      };

      if (options.adminSignUp) {
        const params = {
          UserPoolId: process.env.UserPoolId,
          TemporaryPassword: Password,
          MessageAction: "SUPPRESS",
          Username,
          UserAttributes: [
            ...UserAttributes.filter(
              item =>
                item.Name === "email" ||
                item.Name === "phone_number" ||
                item.Name === "custom:authProvider"
            ),
            {
              Name: "email_verified",
              Value: "true"
            }
          ]
        };

        console.log("adminCreateUser params", params);
        console.log("adminCreateUser cb", cb);

        cognitoIdentityServiceProvider.adminCreateUser(params, cb);
      } else {
        const params = {
          ClientId: process.env.ClientAppId,
          Password,
          Username,
          UserAttributes: UserAttributes.filter(
            item =>
              item.Name === "email" ||
              item.Name === "phone_number" ||
              item.Name === "custom:authProvider"
          )
        };

        cognitoIdentityServiceProvider.signUp(params, cb);
      }
    });
  }

  /**
   * Lists the users in the Amazon Cognito user pool.
   *
   * @param {String} filter A filter string of the form "AttributeName Filter-Type "AttributeValue"". Quotation marks within the filter string must be escaped using the backslash () character.
   * @param {Object} options Additional filter options
   *
   * @returns {Array} Array of cognito users
   */
  getCognitoUsersList(filter = null, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        const params = {
          UserPoolId: process.env.UserPoolId,
          ...options
        };

        if (filter) {
          params.Filter = filter;
        }

        console.log({ params });

        cognitoIdentityServiceProvider.listUsers(params, (err, data) => {
          if (err) return reject(err);
          console.log("data", data.length, data);

          resolve(data);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async getAllCognitoUsers(filter = null, options = {}) {
    let allUsers = [];

    let fullOptions = {
      ...options,
      Limit: 60
    };

    let response = {};

    do {
      if (response.PaginationToken) {
        fullOptions.PaginationToken = response.PaginationToken;
      }

      response = await this.getCognitoUsersList(filter, fullOptions);

      allUsers = [...allUsers, ...response.Users];
    } while (
      response.Users &&
      response.Users.length > 0 &&
      response.PaginationToken
    );

    console.log("allUsers l", allUsers.length);

    return allUsers;
  }

  /**
   * Checks if user exists in cognito
   *
   * @param {object} param `{ username?, phoneNumber?, email? }`
   *
   * @returns {Array}
   */
  async checkCognitoUserExists(
    { username, phoneNumber, email },
    parseAttribs = true
  ) {
    let response = [];

    if (email) {
      const cognitoResponse = await this.getCognitoUsersList(
        `email = \"${email}\"`
      );

      response = cognitoResponse.Users || [];
    }

    if (username && !response.length) {
      const cognitoResponse = await this.getCognitoUsersList(
        `username = \"${username}\"`
      );

      response = cognitoResponse.Users || [];
    }

    if (phoneNumber && !response.length) {
      const cognitoResponse = await this.getCognitoUsersList(
        `phone_number = \"${phoneNumber}\"`
      );

      response = cognitoResponse.Users || [];
    }

    if (response.length) {
      let processedResponse = response;

      if (parseAttribs) {
        processedResponse = response.map(user =>
          this.parseCognitoUserAttributes(user)
        );
      }

      return [true, processedResponse];
    }

    return [false, null];
  }

  /**
   * Updates cognito user
   *
   * @param {object} userUpdate Cognito updates `{ updated: [], deleted: [] }`
   * @param {object} identifier user identifier: one of ``{ accessToken, username }``
   */
  async updateCognitoUser(userUpdate, identifier) {
    if (_.isArray(userUpdate.deleted) && userUpdate.deleted.length) {
      await this.deleteUserAttributes(identifier, userUpdate.deleted);
    }

    if (_.isArray(userUpdate.updated) && userUpdate.updated.length) {
      await this.updateUserAttributes(identifier, userUpdate.updated);
    }
  }

  /**
   * Updates cognito user attributes
   *
   * @param {object} identifier user identifier: one of ``{ accessToken, username }``
   * @param {object} update Cognito updates array
   */
  updateUserAttributes(identifier, update) {
    return new Promise(function(resolve, reject) {
      if (!identifier) {
        return reject("updateUserAttributes identifier provided");
      }

      const callback = (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      };

      const { accessToken, username } = identifier;

      if (accessToken) {
        const params = {
          AccessToken: accessToken,
          UserAttributes: update
        };

        cognitoIdentityServiceProvider.updateUserAttributes(params, callback);
      } else if (username) {
        const params = {
          UserPoolId: process.env.UserPoolId,
          Username: username,
          UserAttributes: update
        };

        cognitoIdentityServiceProvider.adminUpdateUserAttributes(
          params,
          callback
        );
      } else {
        reject("updateUserAttributes No identifier provided");
      }
    });
  }

  /**
   *  Convert Cognito UserAttributes response into plain object \
   *  Returns object
   *
   *  @param cognitoResponse Cognito User Response
   */
  parseCognitoUserAttributes(User) {
    if (User.Enabled === false) {
      throw {
        code: "UserWasDeleted",
        message: "User was deleted"
      };
    }

    const attribs = User.UserAttributes || User.Attributes;

    if (!attribs) throw Error("no user attributes");

    const user = attribs.reduce((accumlator, attr) => {
      accumlator[_.replace(attr.Name, "custom:", "")] = attr.Value;
      return accumlator;
    }, {});

    user.username = User.Username;
    user.userCreateDate = User.UserCreateDate;

    return user;
  }

  /**
   * Gets the user attribute verification code for the specified attribute name.
   *
   * @param {String} AccessToken The access token returned by the server response to get the user attribute verification code.
   * @param {String} AttributeName The attribute name returned by the server response to get the user attribute verification code.
   *
   * @returns the de-serialized data returned from the request.
   */
  getUserAttributeVerificationCode(AccessToken, AttributeName) {
    return new Promise((resolve, reject) => {
      const params = {
        AccessToken,
        AttributeName
      };

      cognitoIdentityServiceProvider.getUserAttributeVerificationCode(
        params,
        (err, data) => {
          if (err) return reject(err);

          resolve(data);
        }
      );
    });
  }

  /**
   * Verifies the specified user attributes in the user pool.
   *
   * @param {String} AccessToken Represents the access token of the request to verify user attributes.
   * @param {String} AttributeName The attribute name in the request to verify user attributes.
   * @param {String} Code The verification code in the request to verify user attributes.
   *
   * @returns the de-serialized data returned from the request.
   */
  verifyUserAttribute(AccessToken, AttributeName, Code) {
    return new Promise((resolve, reject) => {
      const params = {
        AccessToken,
        AttributeName,
        Code
      };

      cognitoIdentityServiceProvider.verifyUserAttribute(
        params,
        (err, data) => {
          if (err) return reject(err);

          resolve(data);
        }
      );
    });
  }

  /**
   * Deletes the user attributes in a user pool
   *
   * @param {String} identifier User identifier: one of ``{ accessToken, username }``
   * @param {Array} UserAttributeNames Array of Attribute to delete names
   */
  deleteUserAttributes(identifier, UserAttributeNames) {
    return new Promise(function(resolve, reject) {
      if (!identifier) {
        return reject("deleteUserAttributes No identifier provided");
      }

      const callback = (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      };

      const { accessToken, username } = identifier;

      if (accessToken) {
        const params = {
          AccessToken: accessToken,
          UserAttributeNames
        };

        cognitoIdentityServiceProvider.deleteUserAttributes(params, callback);
      } else if (username) {
        const params = {
          UserPoolId: process.env.UserPoolId,
          Username: username,
          UserAttributeNames
        };

        cognitoIdentityServiceProvider.adminDeleteUserAttributes(
          params,
          callback
        );
      } else {
        reject(" deleteUserAttributes No identifier provided");
      }
    });
  }

  changePassword(identifier, oldPassword, newPassword) {
    return new Promise((resolve, reject) => {
      if (!identifier) {
        return reject("deleteUserAttributes No identifier provided");
      }

      const callback = (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      };

      const { accessToken, username } = identifier;

      if (accessToken) {
        const params = {
          AccessToken: accessToken,
          PreviousPassword: oldPassword /* required */,
          ProposedPassword: newPassword /* required */
        };

        cognitoIdentityServiceProvider.changePassword(params, callback);
      } else if (username) {
        const params = {
          UserPoolId: process.env.UserPoolId,
          Username: username,
          Password: newPassword /* required */,
          Permanent: true
        };

        cognitoIdentityServiceProvider.adminSetUserPassword(params, callback);
      } else {
        reject(" deleteUserAttributes No identifier provided");
      }
    });
  }

  disableUser(username) {
    return new Promise((resolve, reject) => {
      const params = {
        UserPoolId: process.env.UserPoolId,
        Username: username
      };

      cognitoIdentityServiceProvider.adminDisableUser(params, (err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  deleteUser(username) {
    return new Promise((resolve, reject) => {
      const params = {
        UserPoolId: process.env.UserPoolId,
        Username: username
      };

      cognitoIdentityServiceProvider.adminDeleteUser(params, (err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }
}

module.exports = UserCognitoManager;
