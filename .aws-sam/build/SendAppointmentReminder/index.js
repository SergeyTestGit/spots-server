const _ = require("lodash");
const moment = require("moment");

// Constants
const NotificationType = require("/opt/nodejs/Constants/NotificationType");

// Managers
const JobsManager = require("/opt/JobsManager");
const UserCognitoManager = require("/opt/UserCognitoManager");
const NotificationManager = require("/opt/NotificationsManager");

const sendAuthorNotification = async job => {
  console.log({ s: "sendAuthorNotification", job });
  const author = await UserCognitoManager.getCognitoUser({
    username: job.author
  });
  console.log({ job, author });

  const timeToSend = author.isPremium ? 45 : 30;

  if (moment(job.startDate).diff(moment(), "minutes") > timeToSend) return;

  NotificationManager.sendNotification(
    job.author,
    NotificationType.trackingAvailable,
    {
      jobId: job._id
    }
  ).catch(err => console.log("err", err));
};

const sendDoerNotification = async job => {
  console.log({ s: "sendDoerNotification", job });
  const doer = await UserCognitoManager.getCognitoUser({
    username: job.doer
  });
  console.log({ job, doer });

  const timeToSend = doer.isPremium ? 45 : 30;

  if (moment(job.startDate).diff(moment(), "minutes") > timeToSend) return;

  NotificationManager.sendNotification(
    job.doer,
    NotificationType.appointmentRemider,
    {
      jobId: job._id
    }
  ).catch(err => console.log("err", err));
};

module.exports.handler = async (event, context, callback) => {
  try {
    const jobs = await JobsManager.getJobsStarts45Minutes();

    jobs.forEach(job => {
      sendAuthorNotification(job);
      sendDoerNotification(job);
    });
  } catch (error) {
    console.log("archive jobs cron error", error);

    callback(error);
  }
};
