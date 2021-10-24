const _ = require("lodash");

const filterByServiceProvided = (serviceProvider, filterData, user) => {
  const { categories: filterCategories } = filterData;

  const { services = [] } = serviceProvider;

  const isInFilter = _.some(
    services,
    item =>
      item.status === "active" &&
      (filterCategories.indexOf(item.categoryId) > -1 ||
        (item.serviceId && filterCategories.indexOf(item.serviceId) > -1))
  );

  if (isInFilter) {
    return serviceProvider;
  }

  return null;
};

module.exports = filterByServiceProvided;
