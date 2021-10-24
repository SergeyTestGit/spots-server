const units = {
  meter: "meter",
  kilometre: "kilometre",
  mile: "mile"
};

const metersInUnit = {
  [units.meter]: 1,
  [units.kilometre]: 1000,
  [units.mile]: 1609.344
};

module.exports = units;
module.exports.metersInUnit = metersInUnit;
