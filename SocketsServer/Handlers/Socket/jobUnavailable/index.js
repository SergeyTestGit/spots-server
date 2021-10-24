const NotificationType = require("../../../Constants/NotificationType");

module.exports = async (data, connection) => {
  const { userId, ...newData } = data;
  NotificationManager.createNotification({
    userId,
    notificationType: NotificationType.jobUnavailable,
    data: {
      ...newData,
    }
  });
};
