const _ = require("lodash");

const filterByCategory = (job, filterData, user) => {
  const { categories: filterCategories } = filterData;

  const { category, service = null } = job;

  if (
    filterCategories.indexOf(category) > -1 ||
    (service && filterCategories.indexOf(service) > -1)
  ) {
    return job;
  }

  return null;
};

module.exports = filterByCategory;
