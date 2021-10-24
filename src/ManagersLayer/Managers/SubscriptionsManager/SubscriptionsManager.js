const { NODE_ENV } = process.env;
const _ = require("lodash");
const moment = require("moment");

const Subscription = require("./Subscription.model");

const CommonItemsManager = require(NODE_ENV === 'test' ? "../CommonManager/CommonManager" : "/opt/CommonManager");
const TransactionManager = require(NODE_ENV === 'test' ? "../TransactionsManager/Transaction.manager" : "/opt/TransactionsManager");
const UserManager = require(NODE_ENV === 'test' ? "../UserManager/UserManager" : "/opt/UserManager");

const CommonItemType = require(NODE_ENV === 'test' ? "../../../../shared/nodejs/Constants/commonItemTypes" : "/opt/nodejs/Constants/commonItemTypes");
const SubscriptionType = require(NODE_ENV === 'test' ? "../../../../shared/nodejs/Constants/SubscriptionType" : "/opt/nodejs/Constants/SubscriptionType");
const {
  SubscriptionPurhcasePaymentMethod
} = require(NODE_ENV === 'test' ? "../../../../shared/nodejs/Constants/PaymentMethod" : "/opt/nodejs/Constants/PaymentMethod");
const {
  TransactionType,
  PtsOperationType
} = require(NODE_ENV === 'test' ? "../../../../shared/nodejs/Constants/TransactionTypes" : "/opt/nodejs/Constants/TransactionTypes");

class SubscriptionsManager {
  async getMonthlySubscriptionPrice() {
    return await CommonItemsManager.getCommonItem(
      CommonItemType.monthPremiumSubscriptionCost
    );
  }

  async getYearlySubscriptionPrice() {
    return await CommonItemsManager.getCommonItem(
      CommonItemType.yearPremiumSubscription
    );
  }

  async getSubscriptionsCost() {
    const monthly = await this.getMonthlySubscriptionPrice();
    const yearly = await this.getYearlySubscriptionPrice();

    const res = {
      monthly,
      yearly
    };

    return res;
  }

  async subscribe(subscriptionType, userId, paymentMethod) {
    let amount = null;

    if (subscriptionType === SubscriptionType.monthly) {
      amount = (await this.getMonthlySubscriptionPrice()).val;
    } else if (subscriptionType === SubscriptionType.yearly) {
      const pricePerMonth = await this.getYearlySubscriptionPrice();

      amount = pricePerMonth.val;
    }

    if (!amount) {
      throw {
        code: "InvalidSubscriptionType",
        message: "Invalid subscription type",
        details: {
          actualValue: subscriptionType,
          expectedValue: Object.keys(SubscriptionType)
        }
      };
    }

    let subscriptionTransaction = null;

    if (paymentMethod === SubscriptionPurhcasePaymentMethod.points) {
      const usersPtsAmount = await TransactionManager.getUsersPtsAmount(userId);

      console.log({
        amount,
        usersPtsAmount,
        amountT: typeof amount,
        usersPtsAmountT: typeof usersPtsAmount
      });
      if (amount > usersPtsAmount) {
        throw {
          code: "NotEnoughPts",
          message: "Not Enough Points"
        };
      }

      const subscriptionTransactionData = {
        userId,
        transactionType: TransactionType.subscription,
        ptsOperations: [
          {
            opType: PtsOperationType.subscription,
            amount: -amount
          }
        ]
      };

      subscriptionTransaction = await TransactionManager.createTransaction(
        subscriptionTransactionData
      );
    } else if (paymentMethod === SubscriptionPurhcasePaymentMethod.paypal) {
      // pay in payapl
    }

    if (!subscriptionTransaction) {
      throw {
        code: "WrongPaymantMethod",
        message: "Wrong Payment Method"
      };
    }

    const newSubscriptionData = {
      userId,
      subscriptionType,
      transactionId: subscriptionTransaction._id
    };

    const newSubscription = await this.createSubscription(newSubscriptionData);

    const userUpdate = {
      isPremium: true
    };

    await UserManager.updateUser(userUpdate, userId, { username: userId });
  }

  createSubscription(newSubscriptionData) {
    return new Promise((resolve, reject) => {
      const newSubscription = new Subscription(newSubscriptionData);

      newSubscription.save(err => {
        if (err) return reject(err);

        resolve(newSubscription);
      });
    });
  }

  getUsersSubscription(userId) {
    return new Promise((resolve, reject) => {
      Subscription.scan({
        userId: { eq: userId }
      }).exec((err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  async getUsersActiveSubscription(userId) {
    const usersSubscriprions = await this.getUsersSubscription(userId);

    let activeSubscription = _.orderBy(
      usersSubscriprions,
      "createdAt",
      "desc"
    )[0];

    if (!activeSubscription) return null;

    const subscriptionEndDate = moment(activeSubscription.createdAt).add(
      activeSubscription.subscriptionType === "monthly"
        ? { months: 1 }
        : { years: 1 }
    );

    if (moment().isAfter(subscriptionEndDate)) {
      activeSubscription = null;
    }

    return activeSubscription;
  }

  async revertSubscription(userId) {
    const userUpdate = {
      isPremium: false
    };

    await UserManager.updateUser(userUpdate, userId, { username: userId });
  }
}

module.exports = SubscriptionsManager;
