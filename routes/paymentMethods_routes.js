const express = require('express');
const router = express.Router();

const PaymentMethodsController = require('../controllers/paymentMethods');
const paymentMethods = require('../models').paymentmethod;

const paginatedRequest = require('../middlewares/paginatedRequest');
const isAuthenticated = require('../middlewares/isAuthenticated');

router.route('/api/paymentmethods').get(isAuthenticated, PaymentMethodsController.index, paginatedRequest(paymentMethods)).post(isAuthenticated, PaymentMethodsController.create);

module.exports = router;
