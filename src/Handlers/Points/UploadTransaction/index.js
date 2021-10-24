const moment = require("moment");
const { buildResponse } = require("/opt/response.lib.js");

module.exports.handler = async (event, context, callback) => {
  try {
    const {
      preproccessBody,
      getUserFromEvent
    } = require("/opt/request.lib.js");

    const PtsPriceManager = require("/opt/PtsPriceManager");
    const TransactionsManager = require("/opt/TransactionsManager");
    const CommonItemsManager = require("/opt/CommonManager");

    const CommonItemType = require("/opt/nodejs/Constants/commonItemTypes");
    const {
      TransactionType,
      PtsOperationType
    } = require("/opt/nodejs/Constants/TransactionTypes");

    const { validationSchema } = require("./config");

    const [cognitoUser] = await getUserFromEvent(event);

    if (!cognitoUser) {
      return callback(null, buildResponse(401, "Unathorized"));
    }

    const body = await preproccessBody(event, callback, validationSchema);

    if (!body) return;

    const { paymentMethod, amount, transactionId } = body;
    const userId = cognitoUser.username;

    const { price } = (await PtsPriceManager.getAllPtsPrices())[0];

    const ptsAmount = amount / price;

    const expiryDateInfo = await CommonItemsManager.getCommonItem(
      CommonItemType.purchasedPtsValidityPeriod
    );

    const expirationDate = moment()
      .add(expiryDateInfo.val)
      .toDate();

    const newTransactionData = {
      userId: userId,
      transactionType: TransactionType.pts_purchase,
      ptsOperations: [
        {
          opType: PtsOperationType.pts_purchase,
          amount: ptsAmount,
          expirationDate
        }
      ],
      financialOperations: [
        {
          opType: PtsOperationType.pts_purchase,
          amount,
          paymentMethod,
          paymentTransactionId: transactionId
        }
      ]
    };

    const newTransaction = await TransactionsManager.createTransaction(
      newTransactionData
    );

    callback(null, buildResponse(200, newTransaction));
  } catch (error) {
    console.log("buy points, ", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
};
