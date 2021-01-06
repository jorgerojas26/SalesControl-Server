const cash = require('../models').cash;

const sequelize = require('sequelize');
const Op = sequelize.Op;
module.exports = {
    index: async function (req, res, next) {
        let queryObject = {};
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            next();
        } else {
            res.status(401).json({ error: 'Insufficient permissions' });
        }
    },
    create: function (req, res) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
        } else {
            res.status(401).json({ error: 'Insufficient permissions' });
        }
    },
};
