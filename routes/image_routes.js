const express = require("express");
const router = express.Router();


const ImagesController = require("../controllers/images");

router.post("/api/images", ImagesController.create)

module.exports = router;