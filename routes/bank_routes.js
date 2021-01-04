const express = require('express');
const router = express.Router();

const BanksController = require('../controllers/banks');
const Bank = require('../models').bank;

const paginatedRequest = require('../middlewares/paginatedRequest');
const isAuthenticated = require('../middlewares/isAuthenticated');

router.route('/api/banks').get(isAuthenticated, BanksController.index, paginatedRequest(Bank)).post(isAuthenticated, BanksController.create);

module.exports = router;
