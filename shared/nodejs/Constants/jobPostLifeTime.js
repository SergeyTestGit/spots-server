const jobStatus = require('./jobStatus');

const jobPostLifetime = {
  [jobStatus.done]: {
    daysToLive: {
      premium: 90,
      free: 30
    },
    startDateField: "endDate"
  },
  [jobStatus.posted]: {
    daysToLive: {
      premium: 90,
      free: 30
    },
    startDateField: "startDate"
  },
  [jobStatus.canceled]: {
    daysToLive: {
      premium: 90,
      free: 30
    },
    startDateField: "endDate"
  }
};

module.exports = jobPostLifetime;
