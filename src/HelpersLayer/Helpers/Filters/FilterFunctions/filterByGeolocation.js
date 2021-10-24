const { NODE_ENV } = process.env;
const _ = require("lodash");

const { metersInUnit } = require(NODE_ENV === 'test' ? "../../../../../shared/nodejs/Constants/distanceUnit" : "/opt/nodejs/Constants/distanceUnit");

const {
  calcDistanceBetweenUserAndJob
} = require("../../calcDistanceFromCoords");

const filterByLocation = (job, filterData, user) => {
  console.log("filterData", filterData);
  const lengthM = calcDistanceBetweenUserAndJob(filterData, job);

  if (!_.isNumber(lengthM)) {
    if (filterData.no_geolocation_filter !== "true") {
      return null;
    } else {
      return _.assign(job);
    }
  }

  const distanceUnitsDivider = metersInUnit[filterData.distanceUnit];

  const distance = lengthM / distanceUnitsDivider;

  if (filterData.no_geolocation_filter !== "true") {
    if (distance > filterData.radius) {
      return null;
    }
  }

  return _.assign(job, {
    distance: {
      lengthM: _.round(lengthM, 2),
      length: _.round(distance, 2),
      units: filterData.distanceUnit
    }
  });
};

module.exports = filterByLocation;
