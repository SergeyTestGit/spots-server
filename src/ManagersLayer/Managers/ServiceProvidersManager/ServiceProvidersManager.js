"use strict";
const { NODE_ENV } = process.env;

const _ = require("lodash");

// Managers
const UserCognitoManager = require(NODE_ENV === 'test' ? "../UserCognitoManager" : "/opt/UserCognitoManager");
const UserManager = require(NODE_ENV === 'test' ? "../UserManager" : "/opt/UserManager");
const JobsManager = require(NODE_ENV === 'test' ? "../JobsManager" : "/opt/JobsManager");
const ApplyForJobManager = require(NODE_ENV === 'test' ? "../ApplyJobManager" : "/opt/ApplyJobManager");
const JobReviewManager = require(NODE_ENV === 'test' ? "../JobReviewManager" : "/opt/JobReviewManager");

// Helpers
const {
  calcDistanceBetweenUserAndJobWithParams
} = require(NODE_ENV === 'test' ? "../../../HelpersLayer/Helpers/calcDistanceFromCoords" : "/opt/Helpers/calcDistanceFromCoords");
const SPFilterQueue = require(NODE_ENV === 'test' ? "../../../HelpersLayer/Helpers/Filters/SPFilterQueue" : "/opt/Helpers/Filters/SPFilterQueue");

class ServiceProvidersManager {
  /**
   * Returns SP Profile
   *
   * @param {String} userId SP id
   * @param {User} userWhoRequest User Who Requests. Will try to calcualte distance between SP and userWhoRequest
   *
   * @returns {User} SP profile
   */
  async getSPProfile(
    userId,
    userWhoRequest = null,
    queryParams,
    populate = {}
  ) {
    const user = await UserManager.getFullUser(
      { username: userId },
      { populate: true }
    );

    if (!user.isProvider) {
      throw Error("NotServiceProvider");
    }

    const profile = _.omit(user, [
      "authProvider",
      "isAgreedWithTerms",
      "phone_number_verified",
      "email_verified",
      "favouritesJobs",
      "defaultRadius"
    ]);

    profile.idVerified = user.idPics.length > 0;

    if (userWhoRequest) {
      profile.distance = calcDistanceBetweenUserAndJobWithParams(
        userWhoRequest,
        profile,
        queryParams
      );

      const FavouriteSPManager = require("/opt/FavouriteSPManager");

      const userFavSPList = await FavouriteSPManager.getUsersFavouriteSPs(
        userWhoRequest.username
      );

      const favSp = _.find(userFavSPList, favSp => favSp.spId === userId) || {};
      profile.favouriteId = favSp._id || null;
    }

    if (populate.appliedJobs) {
      profile.applications = await ApplyForJobManager.getUsersApplications(
        user.username
      );
    }

    profile.services = (profile.services || []).filter(
      service => service.status === "active"
    );

    profile.jobsDoneCount = (await JobsManager.getUsersDoneJobs(
      user.username
    ) || []).length;

    profile.reviewsCount = (await JobReviewManager.getReviewsForUser(
      userId
    )).length;

    return profile;
  }

  /**
   * Returns List of Full Service providers
   */
  async getFullServiceProvidersList() {
    const manager = new ServiceProvidersManager();

    const cognitoUsers = await UserCognitoManager.getAllCognitoUsers();

    const spPromises = [];

    cognitoUsers.forEach(user => {
      if (user.Enabled === true) {
        const userAttribs = UserCognitoManager.parseCognitoUserAttributes(user);

        if (userAttribs.isProvider === "1" || userAttribs.isProvider === 1) {
          spPromises.push(
            manager
              .getSPProfile(userAttribs.username)
              .then(usr => usr)
              .catch(err => {
                console.log("err", userAttribs.username, err);

                return null;
              })
          );
        }
      }
    });

    const spList = await Promise.all(spPromises);

    return _.compact(spList);
  }

  /**
   * Returns filtered SP list
   *
   * @param {SPFilterQueue} filter
   * @param {Object} user current user
   */
  async getFilteredSPList(
    filter,
    user = null,
    funcToGetList = this.getFullServiceProvidersList
  ) {
    if (!filter instanceof SPFilterQueue) {
      throw Error("Invalid filter queue");
    }

    const spList = await funcToGetList(user && user.username);

    let favourites = [];

    if (user && user.username) {
      const FavouriteSPManager = require("/opt/FavouriteSPManager");

      favourites = await FavouriteSPManager.getUsersFavouriteSPs(user.username);
    }

    console.log("spList", spList);
    console.log("favourites", favourites);

    const filteredList = await filter.apply(spList);

    const processedList = filteredList.map(sp => {
      const favSP = _.find(favourites, fav => fav.spId === sp.username);

      return _.assign(sp, {
        favouriteId: favSP ? favSP._id : null
      });
    });

    return processedList;
  }
}

module.exports = ServiceProvidersManager;
