const express = require("express");
const router = express.Router();

const SupplyingsController = require("../controllers/supplyings");
const Supplying = require("../models").Supplying;

const paginatedRequest = require("../middlewares/paginatedRequest");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.route("/api/supplyings").get(SupplyingsController.index, paginatedRequest(Supplying))
    .post(isAuthenticated, SupplyingsController.create)

router.route("/api/supplyings/:id")
    .delete(isAuthenticated, SupplyingsController.destroy)

module.exports = router;