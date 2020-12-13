const express = require("express");
const router = express.Router();

const DiscountsController = require("../controllers/discounts");
const Discount = require("../models").Discount;

const paginatedRequest = require("../middlewares/paginatedRequest");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.route("/api/discounts").get(isAuthenticated, DiscountsController.index, paginatedRequest(Discount))
    .post(isAuthenticated, DiscountsController.create);

router.route("/api/discounts/:id").delete(isAuthenticated, DiscountsController.destroy)


module.exports = router;