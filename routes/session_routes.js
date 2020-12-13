const express = require("express");
const router = express.Router();

const SessionsController = require("../controllers/sessions");

router.route("/sessions").post(SessionsController.create);
router.route("/sessions/isAuthenticated").get(SessionsController.checkUserAuth)
module.exports = router;