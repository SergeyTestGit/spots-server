const _ = require("lodash");

const AuthManager = require("../../../Managers/AuthManager");
const NotificationsManager = require("../../../Managers/NotificationManager");

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

    const { notificationsIds } = req.body;

    if (!notificationsIds) return res.status(400).send();

    await NotificationsManager.markNotificationsAsRead(notificationsIds);

    res.status(200).send();
  } catch (err) {
    next(err);
  }
};
