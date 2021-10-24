const _ = require("lodash");
const moment = require("moment");

const Transaction = require("./Transaction.model");
const PendingTransaction = require("../PaypalManager/PendingTransaction.model");

class TransactionManager {
  createTransaction(transactionData) {
    return new Promise((resolve, reject) => {
      const newTransaction = new Transaction(transactionData);

      newTransaction.save(err => {
        if (err) return reject(err);

        resolve(newTransaction);
      });
    });
  }

  getUsersTransactions(userId) {
    return new Promise((resolve, reject) => {
      const filter = {
        userId: { eq: userId }
      };

      Transaction.scan(filter, (err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  getUsersPendingTransactions(userId) {
    return new Promise((resolve, reject) => {
      const filter = {
        userId: { eq: userId }
      };

      PendingTransaction.scan(filter, (err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  async getUsersPtsAmount(userId) {
    const usersTransactions = await this.getUsersTransactions(userId);
    const usersPendingTransactions = await this.getUsersPendingTransactions(userId);
    console.log('usersPendingTransactions: ', usersPendingTransactions);

    const ptsAmount = _.sumBy(usersTransactions, transaction =>
      _.sumBy(transaction.ptsOperations, op => op.amount)
    );

    const pendingPtsAmount = usersPendingTransactions.reduce((acc, item) => {
      console.log('item.paymentItems[0].item_list.items[0].quantity: ', item.paymentItems[0].item_list.items[0].quantity);
      return acc + item.paymentItems[0].item_list.items[0].quantity;
    }, 0);
    console.log('pendingPtsAmount: ', pendingPtsAmount);

    return (ptsAmount + pendingPtsAmount);
  }

  async getUsersPtsAmountWithExpiryDate(userId) {
    const usersTransactions = await this.getUsersTransactions(userId);
    let expiryDate = moment();

    const ptsAmount = _.sumBy(usersTransactions, transaction =>
      _.sumBy(transaction.ptsOperations, op => {
        const opExpirationDate = moment(op.expirationDate);

        if (op.expirationDate && opExpirationDate.isBefore(expiryDate)) {
          expiryDate = opExpirationDate;
        }

        return op.amount;
      })
    );

    return { ptsAmount, expirationDate: expiryDate.toDate() };
  }

  async getUsersPtsAmountAndPlan(userId) {
    const usersTransactions = await this.getUsersTransactions(userId);

    const ptsAmount = _.sumBy(usersTransactions, transaction =>
      _.sumBy(transaction.ptsOperations, op => op.amount)
    );

    return ptsAmount;
  }
}

module.exports = TransactionManager;
