const _ = require("lodash");

const AuthManager = require("../../../Managers/AuthManager");
const NotificationsManager = require("../../../Managers/NotificationManager");

const getPageList = require("../../../Helpers/getPageList");

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

    const notificationsList = await NotificationsManager.getFullUsersNotificationsList(
      user.username
    );

    const pageNumber = req.query.page_number || 0;
    const elementsPerPage = req.query.elements_per_page || 10;

    const pageList = getPageList(
      notificationsList,
      pageNumber,
      elementsPerPage
    );

    res.status(200).send(pageList);
  } catch (err) {
    next(err);
  }
};
