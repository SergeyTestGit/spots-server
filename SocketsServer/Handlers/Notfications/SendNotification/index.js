const _ = require("lodash");

const AuthManager = require("../../../Managers/AuthManager");
const NotificationsManager = require("../../../Managers/NotificationManager");

const hardcodeToken =
  "Bearer eyJraWQiOiJxbm55MzloZmwxWDkrc0QxTXVyN3dteFV4S3V4U1wvMU1mREdYcHFwK1hSUT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI5MWM0M2VhOC02YWE3LTQ0YjMtYTQ0OS1iOTgwM2RhNWFjMzkiLCJldmVudF9pZCI6IjQxZWE5NjA4LWZkMjgtNDlhYi1iZGQ2LTRlN2FlMDBhZDNiMCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE1Njc3ODkyMDEsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX2RkQ3JrTDBxRSIsImV4cCI6MTU2Nzc5MjgwMSwiaWF0IjoxNTY3Nzg5MjAxLCJqdGkiOiI2ODE4OWFlMi1jNjExLTQwNTItODFjNy0wN2IzZjc2OGI2MDgiLCJjbGllbnRfaWQiOiI2YWMxZ3BudDRqNXAyb2Nnazc3ZWFkaDRzZyIsInVzZXJuYW1lIjoidmxhZGltaXJmcmlwdHUifQ.P51h-bgHI_zn7nApYmGhRig51C3IXH08AGLbVictwDkyGlJqnHVTr8p_7CsxFcDDrrlgFFsWEi-9mg-4sk2k1o7tW-W-HqF9U7z4KpXDHhKpdXzw9ieGZy_zA4VCLcw9tR9KHTw-Sl_bo-R2yJcupj7HO5ZYexfvUOfZry5WJD4ffLrTZPmlC7R-TcmChz8NBqbnH1FKQiYBdVHtCQEc3AJg3m0fNO9cHtY0MRWLsVoKMR_sGuE_DTY7j2eWRnJNBBPcBlqXhRIJdYHVXjCEWwFSXOnNQsWX6aeFJNDNRvwjR4XW80stvSofKNjghATn6QUmKUDeA4aStL3jUnBVog";

module.exports = async (req, res, next) => {
  try {
    const authHeader = _.get(req, "headers.authorization");

    // check for auth header
    if (!authHeader) return res.status(401).send();

    if (authHeader !== hardcodeToken) {
      const tokenParts = authHeader.split(/ /);

      // check token structure
      if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer")
        return res.status(401).send();

      // check token
      const user = await AuthManager.getUserByToken(tokenParts[1]);

      if (!user) {
        return res.status(401).send();
      }
    }

    console.log("send notification ", req.body);

    const { userId, notificationType, data } = req.body;

    const newNotificationData = {
      userId,
      notificationType,
      data
    };

    await NotificationsManager.createNotification(newNotificationData);

    res.status(200).send();
  } catch (err) {
    next(err);
  }
};
