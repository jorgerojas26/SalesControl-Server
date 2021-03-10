
const express = require('express');
const router = express.Router();

const SalesReportsController = require('../controllers/salesReports');

const isAuthenticated = require('../middlewares/isAuthenticated');

router.route('/api/reports/sales').get(isAuthenticated, SalesReportsController.index);

router.route('/api/reports/sales/payments').get(isAuthenticated, SalesReportsController.payments);

router.route('/api/reports/debts').get(isAuthenticated, SalesReportsController.debts);
module.exports = router;

