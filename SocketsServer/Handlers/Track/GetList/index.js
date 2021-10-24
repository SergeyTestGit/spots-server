const _ = require("lodash");
const moment = require("moment");

const AuthManager = require("../../../Managers/AuthManager");
const JobsManager = require("../../../Managers/Job.manager");

module.exports = async (req, res, next) => {
  try {
    const authHeader = _.get(req, "headers.authorization");

    // check for auth header
    if (!authHeader) return res.status(401).send();

    const tokenParts = authHeader.split(/ /);

    // check token structure
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer")
      return res.status(401).send();

    // check token
    const user = await AuthManager.getUserByToken(tokenParts[1]);

    if (!user) {
      return res.status(401).send();
    }

    const jobsList = await JobsManager.getUsersBookedJobs(user.username);

    const twoHoursLater = moment().add({ hours: 2 });

    const filteredList = jobsList.filter(job =>
      moment(job.startDate).isBefore(twoHoursLater)
    );

    res.status(200).send(filteredList);
  } catch (err) {
    next(err);
  }
};
