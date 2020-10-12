const express = require("express");
const router = express.Router();

const checkInventory = require("../middlewares/checkInventory");

const isAuthenticated = require("../middlewares/isAuthenticated");
const paginatedRequest = require("../middlewares/paginatedRequest");

const Product = require("../models").Product;

router.get("/api/inventory", isAuthenticated, checkInventory, paginatedRequest(Product));

router.get("/api/inventory/:productId", isAuthenticated, checkInventory, paginatedRequest(Product))
module.exports = router;