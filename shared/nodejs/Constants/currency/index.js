const _ = require("lodash");

const countryCurrencies = require("./spotJobs-country-currencies/data.json");

const currencyCodesList = _.uniq(
  countryCurrencies.map(countryCur => countryCur.code)
);

module.exports.currencyCodesList = currencyCodesList;
