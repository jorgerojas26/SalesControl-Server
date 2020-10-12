const express = require("express");
const router = express.Router();

const DolarReferenceController = require("../controllers/dolarReference");

const DolarReference = require("../models").DolarReference;

const paginatedRequest = require("../middlewares/paginatedRequest");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.route("/api/dolarReference").get(isAuthenticated, DolarReferenceController.index, paginatedRequest(DolarReference))
    .post(isAuthenticated, DolarReferenceController.create);

module.exports = router;