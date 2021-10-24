const _ = require("lodash");

const { spFilters: filters } = require("./FilterFunctions");

const FilterQueue = require("./FilterQueue");

class SPFilterQueue extends FilterQueue {
  constructor(filterQuery, user = null) {
    const filtersQueue = [];

    console.log("SPFilterQueue filterQuery", filterQuery);

    filters.forEach(filter => {
      const filterData = filter.getFilterData(filterQuery, user);

      if (!filterData) return null;

      filtersQueue.push(
        _.assign(filter, {
          filterData
        })
      );
    });

    console.log("SPFilterQueue filtersQueue", filtersQueue);

    super(filtersQueue, user);
  }
}

module.exports = SPFilterQueue;
