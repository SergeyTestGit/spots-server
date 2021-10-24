const _ = require("lodash");

const generateEmail = require("../Assets/EmailNotifications");

const Notification = require("../Models/Notification.model");

const emailTransporter = require("../Libs/mailer.lib");

const JobManager = require("./Job.manager");
const UserCognitoManager = require("./UserCognitoManager");
const SocketsManager = require("./Sockets.manager");

const SocketEventType = require("../Constants/socketEventTypes");

class NotificationManager {
  async createNotification(newNotificationData) {
    console.log("createNotification");
    const receiver = await UserCognitoManager.getCognitoUser({
      username: newNotificationData.userId
    });

    if (!receiver.settings_notif) return;

    const newNotification = new Notification(newNotificationData);

    await newNotification.save();
    console.log("newNotification", newNotification);
    const fullNotification = await this.getFullNotification(newNotification);

    SocketsManager.sendMessage(
      { username: newNotificationData.userId },
      SocketEventType.notificationReceived,
      fullNotification
    ).catch(e => console.log(e));
    console.log("sent", newNotification);

    this.sendEmailNotification(fullNotification).catch(err =>
      console.log("sendEmailNotification", err)
    );

    return newNotification;
  }

  getUsersNotificationList(userId) {
    return new Promise((resolve, reject) => {
      const filter = {
        userId: { eq: userId }
      };

      Notification.scan(filter, (err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  async getFullUsersNotificationsList(userId) {
    const notificationsList = _.orderBy(
      await this.getUsersNotificationList(userId),
      "createdAt",
      "desc"
    );

    const promises = notificationsList.map(notification =>
      this.getFullNotification(notification)
    );

    const fullList = await Promise.all(promises);

    return fullList;
  }

  async getFullNotification(notification) {
    const nextNotification = notification;

    if (notification.data) {
      if (notification.data.userId) {
        notification.data.user = _.pick(
          await UserCognitoManager.getCognitoUser({
            username: notification.data.userId
          }),
          ["given_name", "family_name", "username", "avatarURL", "isPremium"]
        );
      }

      if (notification.data.jobId) {
        notification.data.job = await JobManager.getJobById(
          notification.data.jobId
        );
      }
    }

    return nextNotification;
  }

  updateNotification(notificationId, update) {
    return new Promise((resolve, reject) => {
      Notification.update({ _id: notificationId }, update, (err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  async markNotificationsAsRead(notificationIds) {
    const update = {
      read: true
    };

    const promises = notificationIds.map(notificationId =>
      this.updateNotification(notificationId, update)
    );

    await Promise.all(promises);
  }

  async sendEmailNotification(fullNotification) {
    const email = await generateEmail(fullNotification);

    if (!email) return;

    await this.sendEmail(email.to, email.subject, email.html);
  }

  /**
   * Send an email
   *
   * @param {String} to list of receivers
   * @param {String} subject Subject line
   * @param {String} text plain text body
   * @param {String} html html body
   * @param {String} from sender address
   */
  async sendEmail(
    to,
    subject,
    html,
    text,
    from = "SpotJobs <notifications@spotjobsapp.com>"
  ) {
    const info = await emailTransporter.transporter.sendMail({
      from,
      to,
      subject,
      text,
      html
    });

    console.log("email sent", info);

    return info;
  }
}

module.exports = new NotificationManager();
