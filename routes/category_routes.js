const express = require("express");
const router = express.Router();

const CategoriesController = require("../controllers/category");
const Category = require("../models").Category;

const paginatedRequest = require("../middlewares/paginatedRequest");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.route("/api/categories").get(CategoriesController.index, paginatedRequest(Category))
    .post(isAuthenticated, CategoriesController.create);

router.route("/api/categories/:id").get(CategoriesController.show, paginatedRequest(Category))
    .put(isAuthenticated, CategoriesController.update)
    .delete(isAuthenticated, CategoriesController.destroy)

module.exports = router;