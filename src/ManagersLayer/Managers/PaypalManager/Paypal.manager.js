const _ = require("lodash");
const moment = require("moment");

const { buildResponse } = require("/opt/response.lib.js");

const PtsPriceManager = require("/opt/PtsPriceManager");
const TransactionsManager = require("/opt/TransactionsManager");
const CommonItemsManager = require("/opt/CommonManager");

const CommonItemType = require("/opt/nodejs/Constants/commonItemTypes");
const {
  TransactionType,
  PtsOperationType
} = require("/opt/nodejs/Constants/TransactionTypes");

const PendingTransaction = require("./PendingTransaction.model");

const { paypalCli, configurePaypal } = require("./paypal.lib");

class PaypalManager {
  async createPayment(pointsAmount, userId, callback, usersRedirectUrl) {
    try {
      const redirectURI = `https://spots-jobs.s3-website.us-east-2.amazonaws.com/api/paypal/callback`;

      console.log("createPayment");
      await configurePaypal();
      console.log("configured");

      const { price } = (await PtsPriceManager.getAllPtsPrices())[0];

      console.log({ price });

      const item_list = {};
      const descriptionArray = [`Points❌${pointsAmount}`];
      console.log({ descriptionArray });

      const subtotal = pointsAmount * price;
      console.log({ subtotal });

      item_list.items = [
        {
          name: "Points",
          quantity: pointsAmount,
          price: price,
          currency: "USD"
        }
      ];
      console.log({ item_list });

      let amountTotal = subtotal;
      console.log({ amountTotal });

      const details = {
        subtotal
      };
      console.log({ details });

      const paymentDescription = _.join(descriptionArray, " + ");
      console.log({ paymentDescription });

      const fullRedirectUri = `${redirectURI}${
        usersRedirectUrl ? `?$redirect_uri=${usersRedirectUrl}` : ""
      }`;
      console.log({ fullRedirectUri });

      const payment = {
        intent: "sale",
        payer: {
          payment_method: "paypal"
        },
        redirect_urls: {
          return_url: fullRedirectUri,
          cancel_url: fullRedirectUri
        },
        transactions: [
          {
            amount: {
              currency: "USD",
              total: amountTotal,
              details
            },
            description: paymentDescription,
            item_list
          }
        ]
      };

      console.log({ payment });
      await new Promise((resolve, reject) => {
        paypalCli.payment.create(payment, async (error, payment) => {
          try {
            var links = {};

            console.log("\n\n", payment, "\n\n");

            if (error) {
              console.error("[ERROR] paypal payment creation\n", error);

              callback(null, buildResponse(400, { error }));
              reject(error);
              return;
            }

            const pendingPayment = {
              transactionId: payment.id,
              paymentItems: payment.transactions,
              totalAmount: pointsAmount,
              userId: userId
            };

            await PendingTransaction.create(pendingPayment);

            // Capture HATEOAS links
            payment.links.forEach(function(linkObj) {
              links[linkObj.rel] = {
                href: linkObj.href,
                method: linkObj.method
              };
            });

            // If redirect url present, redirect user
            if (links.hasOwnProperty("approval_url")) {
              const ptsAmount = await TransactionsManager.getUsersPtsAmount(userId);
              console.log('ptsAmount: ', ptsAmount);
              callback(
                null,
                buildResponse(200, { 
                  redirectURI: links.approval_url.href,
                  ptsAmount
                })
              );
              resolve();
            } else {
              console.log(error, payment);
              callback(null, buildResponse(500, { status: false }));
              reject();
            }
          } catch (error) {
            console.log("create payment error, ", error);

            callback(null, buildResponse(500, "Internal server error"));
            reject(error);
          }
        });
      });
    } catch (err) {
      console.error("Create payment error", err);

      throw err;
    }
  }

  callback(queryStringParameters) {
    return new Promise((resolve, reject) => {
      configurePaypal().then(() => {
        const { paymentId, PayerID } = queryStringParameters;

        const payerId = {
          payer_id: PayerID
        };

        paypalCli.payment.execute(paymentId, payerId, async function(
          error,
          payment
        ) {
          try {
            let status = "Success";
            if (error) {
              console.error(error);

              status = "Failure";
            } else {
              if (payment.state !== "approved") {
                status = "Failure";
              }
            }

            const pendingPayment = await PendingTransaction.get({
              transactionId: paymentId
            });

            const expiryDateInfo = await CommonItemsManager.getCommonItem(
              CommonItemType.purchasedPtsValidityPeriod
            );

            const expirationDate = moment()
              .add(expiryDateInfo.val)
              .toDate();

            const newTransactionData = {
              userId: pendingPayment.userId,
              transactionType: TransactionType.pts_purchase,
              ptsOperations: [
                {
                  opType: PtsOperationType.pts_purchase,
                  amount: pendingPayment.totalAmount,
                  expirationDate
                }
              ],
              financialOperations: [
                {
                  opType: PtsOperationType.pts_purchase,
                  amount: pendingPayment.paymentItems[0].amount.total,
                  paypalTransactionId: paymentId
                }
              ]
            };

            await Promise.all([
              TransactionsManager.createTransaction(newTransactionData),
              PendingTransaction.delete({
                transactionId: paymentId
              })
            ]);

            resolve({ status, message: newTransactionData });
          } catch (error) {
            console.log("[ERROR]: /paypal/callback \n", error);
            resolve("Failure", {});
          }
        });
      });
    });
  }
}

module.exports = PaypalManager;
