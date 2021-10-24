const _ = require("lodash");
const axios = require("axios");

class NotificationsManager {
  async sendNotification(userId, notificationType, data, event) {
    try {
      console.log("send Notification", {
        userId,
        notificationType,
        data
      });

      let authorization = _.get(event, "headers.Authorization");

      if (!authorization) {
        authorization =
          "Bearer eyJraWQiOiJxbm55MzloZmwxWDkrc0QxTXVyN3dteFV4S3V4U1wvMU1mREdYcHFwK1hSUT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI5MWM0M2VhOC02YWE3LTQ0YjMtYTQ0OS1iOTgwM2RhNWFjMzkiLCJldmVudF9pZCI6IjQxZWE5NjA4LWZkMjgtNDlhYi1iZGQ2LTRlN2FlMDBhZDNiMCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE1Njc3ODkyMDEsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX2RkQ3JrTDBxRSIsImV4cCI6MTU2Nzc5MjgwMSwiaWF0IjoxNTY3Nzg5MjAxLCJqdGkiOiI2ODE4OWFlMi1jNjExLTQwNTItODFjNy0wN2IzZjc2OGI2MDgiLCJjbGllbnRfaWQiOiI2YWMxZ3BudDRqNXAyb2Nnazc3ZWFkaDRzZyIsInVzZXJuYW1lIjoidmxhZGltaXJmcmlwdHUifQ.P51h-bgHI_zn7nApYmGhRig51C3IXH08AGLbVictwDkyGlJqnHVTr8p_7CsxFcDDrrlgFFsWEi-9mg-4sk2k1o7tW-W-HqF9U7z4KpXDHhKpdXzw9ieGZy_zA4VCLcw9tR9KHTw-Sl_bo-R2yJcupj7HO5ZYexfvUOfZry5WJD4ffLrTZPmlC7R-TcmChz8NBqbnH1FKQiYBdVHtCQEc3AJg3m0fNO9cHtY0MRWLsVoKMR_sGuE_DTY7j2eWRnJNBBPcBlqXhRIJdYHVXjCEWwFSXOnNQsWX6aeFJNDNRvwjR4XW80stvSofKNjghATn6QUmKUDeA4aStL3jUnBVog";
      }

      await axios({
        method: "post",
        url: process.env.SEND_NOTIFICATION_ENDPOINT,
        data: {
          userId,
          notificationType,
          data
        },
        headers: {
          authorization
        }
      });
    } catch (err) {
      console.log("err send notification", err);
    }
  }
}

module.exports = NotificationsManager;
