const Discount = require('../models').Discount;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const moment = require('moment');

module.exports = {
    index: async function (req, res, next) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            let queryObject = {};

            queryObject.include = ['product'];

            res.findOne = true;

            res.queryObject = queryObject;

            next();
        } else {
            res.status(401).json({ err: 'Insuficcient permissions' });
        }
    },
    create: async function (req, res) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            let discount = await Discount.create({
                productId: req.body.productId,
                percent: req.body.percent,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
            });
            res.status(200).json(discount);
        } else {
            res.status(401).json({ err: 'Insuficcient permissions' });
        }
    },
    show: function (req, res) {},
    destroy: async function (req, res) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            let { id } = req.params;
            await Discount.destroy({ where: { id } });
            res.sendStatus(204);
        } else {
            res.status(401).json({ err: 'Insufficient permissions' });
        }
    },
};

