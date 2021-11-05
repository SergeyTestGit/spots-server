const { 
  getUserFromEvent,
  preproccessBody 
} = require("/opt/request.lib.js");
const { buildResponse } = require("/opt/response.lib.js");

module.exports.handler = async (event, context, callback) => {
  try {
    const _ = require("lodash");
    const moment = require("moment");

    const TransactionsManager = require("/opt/TransactionsManager");
    const CommonItemsManager = require("/opt/CommonManager");
    const {
      TransactionType,
      PtsOperationType
    } = require("/opt/nodejs/Constants/TransactionTypes");
    const CommonItemType = require("/opt/nodejs/Constants/commonItemTypes");
    const { validationSchema } = require("./config");

    const [cognitoUser] = await getUserFromEvent(event);

    if (!cognitoUser) {
      return callback(null, buildResponse(401, "Unathorized"));
    }

    const body = await preproccessBody(event, callback, validationSchema);

    if (!body) return;

    const { amount } = body;
    const userId = cognitoUser.username;

    const expiryDateInfo = await CommonItemsManager.getCommonItem(
      CommonItemType.freePointsActivePeriod
    );

    const expirationDate = moment()
      .add(expiryDateInfo.val)
      .toDate();

    const newTransactionData = {
      userId,
      transactionType: TransactionType.add_seen,
      ptsOperations: [
        {
          opType: PtsOperationType.add_seen,
          amount,
          expirationDate
        }
      ]
    };

    await TransactionsManager.createTransaction(newTransactionData);

    callback(null, buildResponse(200, { transaction: newTransactionData }));
  } catch (error) {
    if (
      error.name &&
      error.name.contains &&
      error.name.contains("Validation")
    ) {
      callback(
        null,
        buildResponse(400, {
          message: "Bad Request",
          details: error.message
        })
      );

      return;
    }

    console.error("post a job error, ", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
};
