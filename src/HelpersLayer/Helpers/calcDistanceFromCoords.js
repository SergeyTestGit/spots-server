const { NODE_ENV } = process.env;
const _ = require("lodash");

const { metersInUnit } = require(NODE_ENV === 'test' ? "../../../shared/nodejs/Constants/distanceUnit" : "/opt/nodejs/Constants/distanceUnit");
const lengthUnits = require(NODE_ENV === 'test' ? "../../../shared/nodejs/Constants/distanceUnit" : "/opt/nodejs/Constants/distanceUnit");

const earthRadius = 6371e3;

const deg2rad = deg => {
  return deg * (Math.PI / 180);
};

/**
 * Returns distance between two points using `haversine` formula\
 * NOTE: This formula is for calculations on the basis of a spherical earth (ignoring ellipsoidal effects).
 *
 * @param {Object} point1 First dot coords `{lat, lon}`
 * @param {Object} point2 Second dot coords `{lat, lon}`
 */
const calcDistanceFromPoints = (point1, point2) => {
  const fi1 = deg2rad(point1.lat);
  const fi2 = deg2rad(point2.lat);
  const deltaFi = deg2rad(point2.lat - point1.lat);
  const deltaLambda = deg2rad(point2.lon - point1.lon);

  const a =
    Math.pow(Math.sin(deltaFi / 2), 2) +
    Math.cos(fi1) * Math.cos(fi2) * Math.pow(Math.sin(deltaLambda / 2), 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceM = earthRadius * c; // distance in metres

  return distanceM;
};

/**
 * Calculates distance between user and job geolocation
 *
 * @param {object} user User
 * @param {object} job Job
 */
const calcDistanceBetweenUserAndJob = (user, job) => {
  if (!user || !job) {
    return null;
  }

  if (!user.geolocation || !job.geolocation) {
    return null;
  }

  const userCoords = _.split(user.geolocation, "/");
  const jobCoords = _.split(job.geolocation, "/");

  const distanceM = calcDistanceFromPoints(
    {
      lat: userCoords[0],
      lon: userCoords[1]
    },
    {
      lat: jobCoords[0],
      lon: jobCoords[1]
    }
  );

  return distanceM;
};

const calcDistanceBetweenUserAndJobWithParams = (user, job, params = {}) => {
  let filterData = {
    geolocation: params.geolocation || user.geolocation,
    distanceUnit: lengthUnits[params.length_units]
      ? params.length_units
      : lengthUnits.kilometre
  };

  const lengthM = calcDistanceBetweenUserAndJob(filterData, job);

  if (!_.isNumber(lengthM)) return null;

  const distanceUnitsDivider = metersInUnit[filterData.distanceUnit];

  const distance = lengthM / distanceUnitsDivider;

  return {
    lengthM: _.round(lengthM, 2),
    length: _.round(distance, 2),
    units: filterData.distanceUnit
  };
};

module.exports = calcDistanceFromPoints;
module.exports.calcDistanceBetweenUserAndJob = calcDistanceBetweenUserAndJob;
module.exports.calcDistanceBetweenUserAndJobWithParams = calcDistanceBetweenUserAndJobWithParams;
