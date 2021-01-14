const Sales = require('../models').Sales;
const Supplying = require('../models').Supplying;
const Product = require('../models').Product;
const sequelize = require('sequelize');
const Op = sequelize.Op;
module.exports = async function (req, res, next) {
    if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
        let { id, name } = req.query;

        let queryObject = {};
        queryObject.include = ['discount'];
        if (name)
            queryObject.where = {
                name: { [Op.like]: `%${name}%` },
            };
        if (id) queryObject.where = { id };

        if (req.params.productId) {
            queryObject.where = {
                id: req.params.productId,
            };
        }
        (queryObject.attributes = {
            include: [
                [
                    sequelize.literal(`(
                        SELECT IFNULL(SUM(ROUND(supplying.quantity, 2)), 0) FROM supplyings as supplying
                        WHERE supplying.productId = Product.id
                    )`),
                    'supplyingsTotal',
                ],
                [
                    sequelize.literal(`(
                            SELECT IFNULL(SUM(ROUND(sales.quantity, 2)), 0) FROM saleproducts as sales
                            WHERE sales.productId = Product.id
                        )`),
                    'salesTotal',
                ],
                [
                    sequelize.literal(`(
                        SELECT IFNULL(SUM(ROUND(supplying.quantity, 2)), 0) FROM supplyings as supplying
                        WHERE supplying.productId = Product.id) - (SELECT IFNULL(SUM(ROUND(sales.quantity, 2)), 0) FROM saleproducts as sales
                        WHERE sales.productId = Product.id)`),
                    'stock',
                ],
            ],
            exclude: ['createdAt', 'updatedAt'],
        }),
            (res.queryObject = queryObject);
        next();
    } else {
        res.status(401).send({ err: 'Insufficient permissions' });
    }
};

