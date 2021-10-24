const NotificationType = require("../../Constants/NotificationType");
const { DEFAULT_BUCKET_NAME } = require("../../Constants/s3.constants");

const UserCognitoManager = require("../../Managers/UserCognitoManager");

const generateEmail = require("./emailGenerator");

const emailTexts = {
  [NotificationType.appliedForJob]: require("./appliedForJob"),
  [NotificationType.appointmentRemider]: require("./appointmentRemider"),
  [NotificationType.appointmentScheduled]: require("./appointmentScheduled"),
  [NotificationType.jobCancelled]: require("./jobCancelled"),
  [NotificationType.jobMatchesProfile]: require("./jobMatchesProfile"),
  [NotificationType.jobRequestAccepted]: require("./jobRequestAccepted"),
  [NotificationType.jobRequestRejected]: require("./jobRequestRejected"),
  [NotificationType.jobUnavailable]: require("./jobUnavailable"),
  [NotificationType.newJobRequest]: require("./newJobRequest"),
  [NotificationType.newMessage]: require("./newMessage"),
  [NotificationType.firstMessage]: require("./firstMessage"),
  [NotificationType.trackingAvailable]: require("./trackingAvailable")
};

const getNotificationsEmail = async notificationData => {
  console.log('notificationData getNotificationsEmail: ', notificationData);
  let emailData = {};

  const receiver = await UserCognitoManager.getCognitoUser({
    username: notificationData.userId
  });
  console.log('receiver: ', receiver);

  if (
    receiver &&
    (!receiver.settings_notif || receiver.account_status === "disabled")
  )
    return null;

  const usersLanguage = receiver.usedLanguage || "en";

  const notificationTypeEmailsData =
    emailTexts[notificationData.notificationType];
  console.log('notificationTypeEmailsData: ', notificationTypeEmailsData);

  if (!notificationTypeEmailsData) return;

  const usersLanguageEmailsTextData = (notificationTypeEmailsData[
    usersLanguage
  ] || notificationTypeEmailsData.en)(notificationData);

  if (!usersLanguageEmailsTextData) return null;

  emailData = {
    ...emailData,
    ...usersLanguageEmailsTextData,
    logoUrl: `https://${DEFAULT_BUCKET_NAME}-097579889258-us-east-1.s3.amazonaws.com/email-icons/FN+2+SPOTJOBS++copy+8.png`
  };

  console.log({ emailData });

  const email = generateEmail(emailData);

  return {
    ...email,
    to: receiver.email
  };
};

module.exports = getNotificationsEmail;
