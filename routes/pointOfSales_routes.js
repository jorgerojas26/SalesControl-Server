const express = require('express');
const router = express.Router();

const PointOfSaleController = require('../controllers/pointofsales');
const PointOfSale = require('../models').pointofsale;

const paginatedRequest = require('../middlewares/paginatedRequest');
const isAuthenticated = require('../middlewares/isAuthenticated');

router.route('/api/pointofsales').get(isAuthenticated, PointOfSaleController.index, paginatedRequest(PointOfSale));
module.exports = router;
