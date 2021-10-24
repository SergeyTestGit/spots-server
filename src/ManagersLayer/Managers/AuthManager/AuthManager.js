const { NODE_ENV } = process.env;
const _ = require("lodash");

const { cognitoIdentityServiceProvider } = require("../CognitoManager");

const UserCognitoManager = require(NODE_ENV === 'test' ? "../UserCognitoManager" : "/opt/UserCognitoManager");

const { authProviders } = require(NODE_ENV === 'test' ? "../../../../shared/nodejs/Constants/authProviders" : "/opt/nodejs/Constants/authProviders");

class AuthManager {
  /**
   * Initiates auth flow
   *
   * @param {String} AuthFlow Cognito AuthFlow
   * @param {Object} AuthParameters Auth params
   * @param {Object} options Additional Auth params
   *
   * @returns Cognito response
   */
  initiateAuth(AuthFlow, AuthParameters, options = {}) {
    return new Promise((resolve, reject) => {
      const cb = (err, data) => {
        if (err) return reject(err);

        console.log(data);
        resolve(data);
      };

      if (options.adminSignIn) {
        const params = {
          ClientId: process.env.ClientAppId,
          UserPoolId: process.env.UserPoolId,
          AuthFlow,
          AuthParameters
        };

        console.log("params", params);
        cognitoIdentityServiceProvider.adminInitiateAuth(params, cb);
      } else {
        const params = {
          ClientId: process.env.ClientAppId,
          AuthFlow,
          AuthParameters
        };

        console.log("params", params);
        cognitoIdentityServiceProvider.initiateAuth(params, cb);
      }
    });
  }

  /**
   * Sign In user; Returns user's tokens
   *
   * @param {String} username
   * @param {String} password
   *
   * @returns Tokens
   */
  async signIn(username, password) {
    const AuthFlow = "USER_PASSWORD_AUTH";
    const AuthParameters = {
      USERNAME: username,
      PASSWORD: password
    };

    const response = await this.initiateAuth(AuthFlow, AuthParameters);

    return response.AuthenticationResult;
  }

  /**
   * Sign In user; Returns user's tokens
   *
   * @param {String} username
   * @param {String} password
   *
   * @returns Tokens
   */
  async adminSignIn(username, password) {
    const AuthFlow = "ADMIN_NO_SRP_AUTH";
    const AuthParameters = {
      USERNAME: username,
      PASSWORD: password
    };

    const response = await this.initiateAuth(AuthFlow, AuthParameters, {
      adminSignIn: true
    });

    return response.AuthenticationResult;
  }

  /**
   * Updates tokens
   *
   * @param {string} refreshToken
   *
   * @returns New user tokens
   */
  async updateAccessToken(refreshToken) {
    const AuthFlow = "REFRESH_TOKEN_AUTH";
    const AuthParameters = {
      REFRESH_TOKEN: refreshToken
    };

    const response = await this.initiateAuth(AuthFlow, AuthParameters);

    return response;
  }

  /**
   * Confirms user signup
   *
   * @param {String} Username
   * @param {String} ConfirmationCode
   *
   * @returns Cognito response
   */
  confirmSignUp(Username, ConfirmationCode = null) {
    return new Promise((resolve, reject) => {
      if (ConfirmationCode) {
        const params = {
          ClientId: process.env.ClientAppId,
          Username,
          ConfirmationCode
        };

        cognitoIdentityServiceProvider.confirmSignUp(params, (err, data) => {
          if (err) return reject(err);

          resolve(data);
        });
      } else {
        const params = {
          UserPoolId: process.env.UserPoolId,
          Username
        };

        cognitoIdentityServiceProvider.adminConfirmSignUp(
          params,
          (err, data) => {
            if (err) return reject(err);

            resolve(data);
          }
        );
      }
    });
  }
  /**
   * Get cognito user's username by username alias
   *
   * @param {String} UsernameAlias One of username/email/phone number
   */
  async getUsersUsername(UsernameAlias) {
    const [
      UserExists,
      UsersList
    ] = await UserCognitoManager.checkCognitoUserExists({
      username: UsernameAlias,
      email: UsernameAlias,
      phoneNumber: UsernameAlias
    });

    if (UserExists) {
      const user = (UsersList && UsersList[0]) || null;

      if (user) {
        if (user.authProvider !== authProviders.cognito) {
          throw Error("oauthUser");
        }

        const username = user.username;

        return username;
      }
    }

    throw {
      message: "User does not exist.",
      code: "UserNotFoundException"
    };
  }

  /**
   * Resends the confirmation (for confirmation of registration) to a specific user.
   *
   * @param {String} UsernameAlias One of username/email/phone number
   */
  resendConfirmationCode(UsernameAlias) {
    return new Promise((resolve, reject) => {
      this.getUsersUsername(UsernameAlias)
        .then(Username => {
          const params = {
            ClientId: process.env.ClientAppId,
            Username
          };

          cognitoIdentityServiceProvider.resendConfirmationCode(
            params,
            (err, data) => {
              if (err) return reject(err);

              resolve(data);
            }
          );
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Forgot user password
   *
   * @param {String} UsernameAlias One of username/email/phone number
   */
  forgotPassword(UsernameAlias) {
    return new Promise((resolve, reject) => {
      this.getUsersUsername(UsernameAlias)
        .then(Username => {
          console.log("Username", Username);
          const params = {
            ClientId: process.env.ClientAppId,
            Username
          };

          cognitoIdentityServiceProvider.forgotPassword(params, (err, data) => {
            if (err) return reject(err);

            resolve(data);
          });
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Allows a user to enter a confirmation code to reset a forgotten password.
   *
   * @param {String} UsernameAlias One of username/email/phone number
   * @param {String} Password New user password
   * @param {String} ConfirmationCode Forgot password confirmation code
   */
  confirmForgotPassword(UsernameAlias, Password, ConfirmationCode) {
    return new Promise((resolve, reject) => {
      this.getUsersUsername(UsernameAlias)
        .then(Username => {
          const params = {
            ClientId: process.env.ClientAppId,
            ConfirmationCode,
            Username,
            Password
          };

          console.log("confirmForgotPassword params", params);

          cognitoIdentityServiceProvider.confirmForgotPassword(
            params,
            (err, data) => {
              if (err) return reject(err);

              resolve(data);
            }
          );
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Revokes user session\
   * Returns Cognito response
   *
   * @param {String} AccessToken User's Access Token
   */
  revokeSession(AccessToken) {
    return new Promise((resolve, reject) => {
      const params = {
        AccessToken
      };

      cognitoIdentityServiceProvider.globalSignOut(params, (err, data) => {
        if (err) return reject(error);

        resolve(data);
      });
    });
  }

  buildIAMPolicy(userId, context, effect, resource) {
    const policy = {
      principalId: userId,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: effect,
            Resource: "*"
          }
        ]
      },
      context
    };

    return policy;
  }

  /**
   * Authorize headers
   * @param {object} event Lambda event object
   */
  async authorizeEvent(event) {
    try {
      if (!_.has(event, ["authorizationToken"])) {
        return ["Unauthorized"];
      }

      const tokenHeader = event.authorizationToken;

      // check token included
      if (!_.isString(tokenHeader)) {
        return ["Unauthorized"];
      }

      const tokenHeaderParts = tokenHeader.split(/ /);

      // check token structure
      if (tokenHeaderParts.length !== 2 || tokenHeaderParts[0] !== "Bearer") {
        return ["Unauthorized"];
      }

      const token = tokenHeaderParts[1];

      const cognitoUser = await UserCognitoManager.getCognitoUser(
        {
          accessToken: token
        },
        true
      );

      const userId = cognitoUser.username;
      const effect = "Allow";
      const authorizerContext = { user: JSON.stringify(cognitoUser), token };
      const policyDocument = this.buildIAMPolicy(
        userId,
        authorizerContext,
        effect,
        event.methodArn
      );
      return [null, policyDocument];
    } catch (error) {
      if (error.code === "NotAuthorizedException") {
        return ["Unauthorized"];
      }

      console.error("Authorizer error", error);

      return ["Internal Server Error"];
    }
  }

  async authorizeSocketEvent(event) {
    const token = JSON.parse(event.body).authorization;

    // check token included
    if (!_.isString(token)) {
      return ["Unauthorized"];
    }

    const cognitoUser = await UserCognitoManager.getCognitoUser({
      accessToken: token
    });

    event.user = cognitoUser;
  }
}

module.exports = AuthManager;
