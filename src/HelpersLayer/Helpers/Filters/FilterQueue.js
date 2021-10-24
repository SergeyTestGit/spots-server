const _ = require("lodash");

class FilterQueue {
  constructor(filtersQueue, user) {
    this.filtersQueue = filtersQueue;
    this.user = user;
  }

  /**
   * Applies filters queue to the separate item
   *
   * @param {object} item
   *
   * @returns {Job} New job data
   */
  async test(item) {
    let nextItem = item;

    const postProcessStack = [];

    for (
      let filterIndex = 0;
      filterIndex < this.filtersQueue.length;
      filterIndex++
    ) {
      const filter = this.filtersQueue[filterIndex];

      nextItem = filter.function(nextItem, filter.filterData, this.user);
      if (!nextItem) return null;

      if (_.isFunction(filter.postprocessFunc)) {
        postProcessStack.push(filter);
      }
    }

    while (postProcessStack.length) {
      const filterWithPostprocess = postProcessStack.pop();

      nextItem = await filterWithPostprocess.postprocessFunc(
        nextItem,
        filterWithPostprocess.filterData,
        this.user
      );
    }

    return nextItem;
  }

  /**
   * Applies filter queue to list
   *
   * @param {Array} itemList Array of items
   *
   * @returns {Array} Filtered array of items
   */
  async apply(itemList) {
    const filteredItemList = [];

    const promises = itemList.map(async job => {
      const filteredItem = await this.test(job);

      if (filteredItem) {
        filteredItemList.push(filteredItem);
      }
    });

    await Promise.all(promises);

    return filteredItemList;
  }
}

module.exports = FilterQueue;
