"use strict";
const { NODE_ENV } = process.env;
const _ = require("lodash");
const uuid = require("uuid");

const FavouriteSP = require("./FavouriteSP");

// Managers
const ServiceProvidersManager = require(NODE_ENV === 'test' ? "../ServiceProvidersManager" : "/opt/ServiceProvidersManager");

class FavouriteSPManager {
  /**
   * Creates a new Favourite SP Record
   *
   * @param {String} userId User ID
   * @param {String} spId New favourite SP ID
   */
  addToFavourites(userId, spId) {
    return new Promise((resolve, reject) => {
      const newRecord = new FavouriteSP({
        _id: uuid.v4(),
        userId,
        spId
      });

      newRecord.save(err => {
        if (err) return reject(err);

        resolve(newRecord);
      });
    });
  }

  /**
   * Deletes a Favourite SP Record
   *
   * @param {String} favouriteSpId Favourite SP id
   */
  deleteFromFavourite(favouriteSpId) {
    return new Promise((resolve, reject) => {
      FavouriteSP.delete({ _id: favouriteSpId }, err => {
        if (err) return reject(err);

        resolve();
      });
    });
  }

  /**
   * Returns user's favourites SPs list (just ID's)
   * @param {String} userId User ID
   *
   * @returns {Array} Array of user's favourites SPs
   */
  getUsersFavouriteSPs(userId) {
    return new Promise((resolve, reject) => {
      const filter = { userId: { eq: userId } };

      FavouriteSP.scan(filter).exec((err, data) => {
        if (err) return reject(err);

        console.log("getUsersFavouriteSPs", data);

        resolve(data);
      });
    });
  }

  /**
   * Returns user's favourites SPs list (with full SP object)
   *
   * @param {String} userId User ID
   *
   * @returns {Array} Array of user's favourites SPs
   * @param {User} user Cognito User object
   */
  async getFullFavouritesSPList(userId, user = null) {
    const manager = new FavouriteSPManager();

    console.log({ userId, user });

    const userFavouriteSPs = await manager.getUsersFavouriteSPs(userId);
    console.log({ userFavouriteSPs });

    const SPPromises = userFavouriteSPs.map(({ spId, _id }) =>
      ServiceProvidersManager.getSPProfile(spId, user)
        .then(sp => {
          return _.assign(sp, { favouriteId: _id });
        })
        .catch(err => {
          return;
        })
    );

    const FavouriteSPList = await Promise.all(SPPromises);

    console.log({ FavouriteSPList });

    return _.compact(FavouriteSPList);
  }

  async deleteUsersFavouriteSPs(userId) {
    const favList = await this.getUsersFavouriteSPs(userId);

    (favList || []).forEach(fav => {
      this.deleteFromFavourite(fav._id);
    });
  }
}

module.exports = FavouriteSPManager;
