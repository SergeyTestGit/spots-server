const _ = require("lodash");
const moment = require("moment");

// Constants
const jobPostLifeTime = require("/opt/nodejs/Constants/jobPostLifeTime");

// Managers
const JobsManager = require("/opt/JobsManager");
const JobsArchiveManager = require("/opt/JobsArchiveManager");
const UserCognitoManager = require("/opt/UserCognitoManager");
const ApplyJobManager = require("/opt/ApplyJobManager");
const FavouriteJobManager = require("/opt/FavouriteJobManager");
const NotificationType = require("/opt/nodejs/Constants/NotificationType");
const NotificationsManager = require("/opt/NotificationsManager");

module.exports.handler = async (event, context, callback) => {
  try {
    const jobs = await JobsManager.getJobList();

    const groupedJobs = _.groupBy(jobs, job => job.jobStatus);
    const promises = [];

    Object.keys(jobPostLifeTime).forEach(jobStatusType => {
      const lifetimeData = jobPostLifeTime[jobStatusType];
      const innerPromises = (groupedJobs[jobStatusType] || []).map(
        async job => {
          console.log({ job });
          let author = null;

          try {
            author = await UserCognitoManager.getCognitoUser({
              username: job.author
            });
          } catch (e) {}

          console.log({ author });
          const startDate = _.get(job, lifetimeData.startDateField, null);
          console.log({ startDate });
          const userStatus = author
            ? author.isPremium
              ? "premium"
              : "free"
            : null;
          console.log({ userStatus });
          const jobPostShouldLiveDays =
            lifetimeData.daysToLive[userStatus] || null;

          console.log({ jobPostShouldLiveDays });
          if (startDate && jobPostShouldLiveDays) {
            const postExists = moment().diff(startDate, "days");

            if (postExists <= jobPostShouldLiveDays) {
              return;
            }
          }
          console.log({ job1: job });

          await JobsArchiveManager.createJob(job);
          await JobsManager.deleteJob(job._id);
        }
      );

      _.concat(promises, innerPromises);
    });

    Promise.all(promises).then(res => {
      callback(null);
    });

    const now = Date.now();
    const jobsForNotificationSending = jobs.filter(({ expiryDate, jobUnavailable }) => now > expiryDate && !jobUnavailable);
    console.log('jobsForNotificationSending: ', jobsForNotificationSending);

    jobsForNotificationSending.forEach(async ({ _id }) => {
      const appliedUsersIds = (await ApplyJobManager.getPeopleWhoAppliedList(_id)).map(({ userId }) => userId);
      console.log('appliedUsersIds: ', appliedUsersIds);
      const usersIdsWithFavoriteJob = (await FavouriteJobManager.getFavouritesByJobId(_id)).map(({ userId }) => userId);
      console.log('usersIdsWithFavoriteJob: ', usersIdsWithFavoriteJob);
      const usersToSendNotification = [...appliedUsersIds, ...usersIdsWithFavoriteJob];

      usersToSendNotification.forEach(userId => {
        NotificationsManager.sendNotification(
          userId,
          NotificationType.jobUnavailable,
          {
            jobId: _id
          },
          event
        ).catch(err => console.error(err));
      });
      await JobsManager.updateJob(_id, { jobUnavailable: true });
    });
  } catch (error) {
    console.log("archive jobs cron error", error);

    callback(error);
  }
};
