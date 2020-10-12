const express = require("express");
const router = express.Router();

const ClientsController = require("../controllers/clients");
const Client = require("../models").Client;

const paginatedRequest = require("../middlewares/paginatedRequest");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.route("/api/clients").get(isAuthenticated, ClientsController.index, paginatedRequest(Client))
    .post(isAuthenticated, ClientsController.create);

module.exports = router;