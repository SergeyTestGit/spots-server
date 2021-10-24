const CommonModel = require("./Common");

const _ = require("lodash");

class CommonManager {
  /**
   * Returns common item from BD
   * @param {String} type common item type
   */
  async getCommonItem(type) {
    const item = await CommonModel.get({ type });

    item.val = JSON.parse(item.val);

    return item;
  }

  /**
   * Puts common item to DB
   *
   * @param {String} type common item type
   * @param {Any} value common item value
   */
  async putCommonItem(type, value) {
    const newCommonItem = new CommonModel({
      type,
      val: JSON.stringify(value)
    });

    await newCommonItem.save();
  }
}

module.exports = CommonManager;
