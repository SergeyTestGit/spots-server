const _ = require("lodash");

const { jobFilters: filters } = require("./FilterFunctions");

const FilterQueue = require("./FilterQueue");

class UserFilterQueue extends FilterQueue {
  constructor(filterQuery, user = null) {
    const filtersQueue = [];

    console.log("JobFilterQueue filterQuery", filterQuery);

    filters.forEach(filter => {
      const filterData = filter.getFilterData(filterQuery, user);

      if (!filterData) return null;

      filtersQueue.push(
        _.assign(filter, {
          filterData
        })
      );
    });

    console.log("JobFilterQueue filtersQueue", filtersQueue);

    super(filtersQueue, user);
  }
}

module.exports = UserFilterQueue;
