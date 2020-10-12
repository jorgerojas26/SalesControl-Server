const express = require("express");
const router = express.Router();

const UserController = require("../controllers/users");
const User = require("../models").User;

const paginatedRequest = require("../middlewares/paginatedRequest");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.route("/api/users").get(isAuthenticated, UserController.index, paginatedRequest(User))
    .post(isAuthenticated, UserController.create);

module.exports = router;