const express = require("express");

const TransctionController = require("../controllers/transactions");

const router = express.Router();

router.get("", TransctionController.getTransactions);

router.get(
  "/:startDate&:endDate",
  TransctionController.getTransactionsByPeriod
);

router.get("/:id", TransctionController.getTransaction);

module.exports = router;
