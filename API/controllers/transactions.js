const Transaction = require("../models/trasactions");
var axios = require("axios");

var data = JSON.stringify({
  client_id: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET_KEY,
  access_token: process.env.PLAID_ACCESS_TOKEN,
});

var config = {
  method: "post",
  url: "https://development.plaid.com/accounts/balance/get",
  headers: {
    "Content-Type": "application/json",
  },
  data: data,
  delayed: true,
};

exports.getTransactions = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = req.query.page;
  const transactionQuery = Transaction.find().sort({ date: -1 });
  let fetchedTransactions;
  if (pageSize && currentPage) {
    transactionQuery.skip(pageSize * currentPage).limit(pageSize);
  }
  transactionQuery
    .then((document) => {
      fetchedTransactions = document;
      return Transaction.count();
    })
    .then((count) => {
      res.status(200).json({
        status: 200,
        message: "Transactions fetched successfully!",
        totalCount: count,
        transactions: fetchedTransactions,
      });
      // axios(config).then(function (response) {
      //   const currentBalance = response.data.accounts[0].balances.current;

      //     .catch((err) =>
      //       res.status(500).json({
      //         status: 500,
      //         message: "Fetching Transactions failed",
      //       })
      //     );
      // });
    })
    .catch((err) => {
      res.status(500).json({
        status: 500,
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
      const balance = calculateBalance(fetchedTransactions);
      res.status(200).json({
        status: 200,
        message: "Transactions fetched successfully!",
        balance: balance,
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

function calculateBalance(trans) {
  balance = 0;
  trans.forEach(function (tran) {
    balance += tran.amount;
  });
  return balance * -1;
}
