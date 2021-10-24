const { NODE_ENV } = process.env;
const ServiceModel = require("./Service");
const CommonManager = require(NODE_ENV === 'test' ? "../CommonManager/CommonManager" : "/opt/CommonManager");

const commonItemTypes = require(NODE_ENV === 'test' ? "../../../../shared/nodejs/Constants/commonItemTypes" : "/opt/nodejs/Constants/commonItemTypes");

class ServiceManager {
  /**
   * Returns services list
   */
  getServicesList() {
    return new Promise((resolve, reject) => {
      ServiceModel.scan().exec((err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  async getCategory(_id) {
    const category = await ServiceModel.get({ _id });

    return category;
  }

  async getPopularServices() {
    const popularCategories = await CommonManager.getCommonItem(
      commonItemTypes.popularCategories
    );

    const categoryPromises = popularCategories.val.map(async item => {
      const category = await this.getCategory(item.categoryId);

      return {
        ...category,
        popularity: item.popularity
      };
    });

    const categories = await Promise.all(categoryPromises);

    return categories;
  }

  async setPopularServices(popularServicesArray) {
    await CommonManager.putCommonItem(
      commonItemTypes.popularCategories,
      popularServicesArray
    );
  }
}

module.exports = ServiceManager;
