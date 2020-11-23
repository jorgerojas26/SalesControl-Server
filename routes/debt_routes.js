const express = require("express");
const router = express.Router();

const DebtsController = require("../controllers/debts");
const Debt = require("../models").Debt;

const paginatedRequest = require("../middlewares/paginatedRequest");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.route("/api/debts").get(isAuthenticated, DebtsController.index, paginatedRequest(Debt))
    .post(isAuthenticated, DebtsController.create);

router.route("/api/debts/:id")
    .put(isAuthenticated, DebtsController.update)
module.exports = router;