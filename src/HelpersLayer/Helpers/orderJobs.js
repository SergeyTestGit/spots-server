const _ = require("lodash");

const orderByType = require("/opt/nodejs/Constants/orderByTypes").job;

const defaultOrderBy = orderByType.distance;
const defaultOrder = "asc";

function orderJobs(
  arrayToSort,
  orderBy = defaultOrderBy,
  order = defaultOrder
) {
  let orderedList = arrayToSort;

  switch (orderBy) {
    case orderByType.new:
      orderedList = _.orderBy(arrayToSort, "createdAt", order);
      break;
    case orderByType.budget:
      orderedList = _.orderBy(arrayToSort, "budget", order);
      break;
    case orderByType.distance:
      orderedList = _.orderBy(
        arrayToSort,
        item => _.get(item, "distance.lengthM"),
        order
      );
      break;
    case orderByType.expiryDate:
      orderedList = _.orderBy(arrayToSort, "expiryDate", order);
      break;
    case orderByType.doneBefore:
      orderedList = _.orderBy(arrayToSort, "doneBefore", order);
      break;
    case orderByType.authorRating:
      orderedList = _.orderBy(
        arrayToSort,
        job => _.get(job, "author.rate", 0),
        order
      );
      break;
    case orderByType.autorVerified:
      orderedList = _.orderBy(
        arrayToSort,
        job => _.get(job, "author.isIdVerified", false),
        order
      );
      break;
    default:
      return orderJobs(arrayToSort);
  }

  const orderedByPremium = _.orderBy(
    orderedList,
    job => _.get(job, "author.isPro", false),
    "desc"
  );

  return orderedByPremium;
}

module.exports = orderJobs;
