const Transaction = require("../models/trasactions");

exports.getTransactions = (req, res, next) => {
  const transactionQuery = Transaction.find();
  let fetchedTransactions;
  transactionQuery
    .then((document) => {
      fetchedTransactions = document;
      return Transaction.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Transactions fetched successfully!",
        totalCount: count,
        transactions: fetchedTransactions,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Fetching Transactions failed",
      });
    });
};

exports.getTransactionsByPeriod = (req, res, next) => {
  const transactionPeriodQuery = Transaction.find({
    date: { $gt: req.params.startDate, $lt: req.params.endDate },
  });
  let fetchedTransactions;
  transactionPeriodQuery
    .then((document) => {
      fetchedTransactions = document;
      return Transaction.count(transactionPeriodQuery);
    })
    .then((count) => {
      res.status(200).json({
        message: "Transactions fetched successfully!",
        totalCount: count,
        transactions: fetchedTransactions,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Fetching Transactions failed",
      });
    });
};

exports.getTransaction = (req, res, next) => {
  Transaction.findById(req.params.id)
    .then((transaction) => {
      if (transaction) {
        res.status(200).json(transaction);
      } else {
        res.status(404).json({ message: "Transaction not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Fetching a transaction failed",
      });
    });
};
