const express = require("express");
const router = express.Router();

const SalesController = require("../controllers/sales");
const checkInventory = require("../middlewares/checkInventory");

const Product = require("../models").Product;

const paginatedRequest = require("../middlewares/paginatedRequest");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.route("/api/sales").get(isAuthenticated, SalesController.index, paginatedRequest(Product))
    .post(isAuthenticated, checkInventory, SalesController.create);

router.route("/api/sales/:id")
    .delete(isAuthenticated, SalesController.destroy)

module.exports = router;