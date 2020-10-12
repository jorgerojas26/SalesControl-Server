const express = require("express");
const router = express.Router();

const SuppliersController = require("../controllers/suppliers");
const Supplier = require("../models").Supplier;

const paginatedRequest = require("../middlewares/paginatedRequest");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.route("/api/suppliers").get(SuppliersController.index, paginatedRequest(Supplier))
    .post(isAuthenticated, SuppliersController.create);

module.exports = router;