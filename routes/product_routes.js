const express = require("express");
const router = express.Router();

const ProductsController = require("../controllers/products");
const Product = require("../models").Product;

const paginatedRequest = require("../middlewares/paginatedRequest");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.route("/api/products")
    .get(ProductsController.index, paginatedRequest(Product))
    .post(isAuthenticated, ProductsController.create);

router.route("/api/products/:id")
    .patch(isAuthenticated, ProductsController.update)
    .delete(isAuthenticated, ProductsController.destroy)

module.exports = router;