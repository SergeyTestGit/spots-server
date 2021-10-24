const _ = require("lodash");

const orderByType = require("/opt/nodejs/Constants/orderByTypes").sp;

const defaultOrderBy = orderByType.distance;
const defaultOrder = "asc";

function orderSP(arrayToSort, orderBy = defaultOrderBy, order = defaultOrder) {
  let orderedList = arrayToSort;

  switch (orderBy) {
    case orderByType.distance:
      orderedList = _.orderBy(
        arrayToSort,
        item => _.get(item, "distance.lengthM"),
        order
      );
      break;
    case orderByType.rating:
      orderedList = _.orderBy(
        arrayToSort,
        item => _.get(item, "rate", 0),
        order
      );
      break;
    case orderByType.new:
      orderedList = _.orderBy(
        arrayToSort,
        item => new Date(item.userCreateDate),
        order
      );
      break;
    case orderByType.proStatus:
      orderedList = _.orderBy(arrayToSort, "isPro", order);
      break;
    case orderByType.verifiedStatus:
      orderedList = _.orderBy(arrayToSort, "isIdVerified", order);
      break;
    case orderByType.startDate:
      orderedList = _.orderBy(arrayToSort, "startDate", order);
      break;

    default:
      return orderSP(arrayToSort);
  }

  const orderedByPremium = _.orderBy(orderedList, sp => sp.isPremium, "desc");

  return orderedByPremium;
}

module.exports = orderSP;
