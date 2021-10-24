const { NODE_ENV } = process.env;
const _ = require("lodash");

const filterByGeolocation = require("./filterByGeolocation");
const filterByCategory = require("./filterByCategory");
const filterByKeywords = require("./filterByKeywords");
const filterByAuthor = require("./filterByAuthor");
const filterByServiceProvided = require("./filterByServiceProvided");
const filterByKeywordsSP = require("./filterByKeywordsSP");
const filterByIgnoredJob = require("./filterByIgnoredJob");

const lengthUnits = require(NODE_ENV === 'test' ? "../../../../../shared/nodejs/Constants/distanceUnit" : "/opt/nodejs/Constants/distanceUnit");

const nonMetricCountries = ["us", "USA"];

/**
 * Array of functions
 * Structure:
 * filterName - filter`s name
 * function - some filter function with parameters (job, filterData, user), must return job object
 * getFilterData - function which extract filter conditions from query; retruns filter or null
 * postprocessFunc - some function(job, filterData, user) which will execute if job pass filters
 */

const filters = {
  filterByCategory: {
    filterName: "filterByCategory",
    function: filterByCategory,
    getFilterData: (filterQuery, user) => {
      if (filterQuery.categories) {
        return {
          categories: filterQuery.categories
        };
      }

      return null;
    }
  },
  filterByServiceProvided: {
    filterName: "filterByServiceProvided",
    function: filterByServiceProvided,
    getFilterData: (filterQuery, user) => {
      if (filterQuery.categories) {
        return {
          categories: filterQuery.categories
        };
      }

      return null;
    }
  },
  filterByKeywords: {
    filterName: "filterByKeywords",
    function: filterByKeywords,
    getFilterData: (filterQuery, user) => {
      if (filterQuery.keywords) {
        return {
          keywords: filterQuery.keywords
        };
      }

      return null;
    }
  },
  filterByKeywordsSP: {
    filterName: "filterByKeywordsSP",
    function: filterByKeywordsSP,
    getFilterData: (filterQuery, user) => {
      if (filterQuery.keywords) {
        return {
          keywords: filterQuery.keywords
        };
      }

      return null;
    }
  },
  filterByAuthor: {
    filterName: "filterByAuthor",
    function: filterByAuthor,
    getFilterData: (filterQuery, user) => {
      if (filterQuery.author) {
        return {
          author: filterQuery.author
        };
      }

      return null;
    }
  },
  // filterByIgnoredJob: {
  //   function: filterByIgnoredJob,
  //   getFilterData: (filterQuery, user) => {
  //     if (!user) return null;

  //     const ignoredJobsList = _.get(user, "ignoredJobsList", null);

  //     if (_.isArray(ignoredJobsList) && ignoredJobsList.length > 0) {
  //       return ignoredJobsList;
  //     } else {
  //       return null;
  //     }
  //   }
  // },
  filterByGeolocation: {
    function: filterByGeolocation,
    getFilterData: (filterQuery, user) => {
      const {
        geolocation,
        radius,
        length_units,
        no_geolocation_filter
      } = filterQuery;

      let filter = {
        geolocation: geolocation,
        radius: radius,
        distanceUnit: lengthUnits[length_units]
          ? length_units
          : lengthUnits.kilometre,
        no_geolocation_filter
      };

      if ((!geolocation || !radius) && user) {
        const { geolocation: userGeolocation, defaultRadius, country } = user;

        const userCountry = _.isString(country) ? _.toLower(country) : null;

        const defaultLengthUnits =
          nonMetricCountries.indexOf(userCountry) > -1
            ? lengthUnits.mile
            : lengthUnits.kilometre;

        filter = {
          geolocation: geolocation || userGeolocation,
          radius: radius || defaultRadius || 10,
          distanceUnit: lengthUnits[length_units]
            ? length_units
            : defaultLengthUnits,
          no_geolocation_filter
        };
      }

      if (filter.geolocation && filter.radius) {
        return filter;
      }

      return null;
    },
    postprocessing: null
  }
};

const jobFilters = [
  filters.filterByCategory,
  filters.filterByKeywords,
  filters.filterByAuthor,
  filters.filterByGeolocation,
  // filters.filterByIgnoredJob
];

const spFilters = [
  filters.filterByKeywordsSP,
  filters.filterByServiceProvided,
  filters.filterByGeolocation
];

module.exports = filters;

module.exports.jobFilters = jobFilters;
module.exports.spFilters = spFilters;
