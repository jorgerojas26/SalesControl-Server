const express = require('express');
const router = express.Router();

const PaymentsController = require('../controllers/payments');
const Payment = require('../models').payment;

const paginatedRequest = require('../middlewares/paginatedRequest');
const isAuthenticated = require('../middlewares/isAuthenticated');

router.route('/api/payments').get(isAuthenticated, PaymentsController.index, paginatedRequest(Payment)).post(isAuthenticated, PaymentsController.create);

module.exports = router;
