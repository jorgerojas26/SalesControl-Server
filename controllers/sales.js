const Sales = require("../models").Sales;
const SaleProducts = require("../models").SaleProducts;
const Product = require("../models").Product;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const moment = require("moment");

module.exports = {
    index: function (req, res, next) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {

            let { productName, productId, id, createdAt, updatedAt, from, to, operation, group } = req.query;
            let queryObject = {}

            res.Model = Sales;

            queryObject.include = [{
                model: SaleProducts,
                as: "saleProducts",
                include: [{
                    model: Product,
                    as: "product"
                }],
                group: ["id"]
            }]
            queryObject.order = [["createdAt", "DESC"]]

            if (productName) queryObject.include = {
                model: SaleProducts,
                as: "saleProducts",
                include: [{
                    model: Product,
                    as: "product",
                    where: {
                        name: { [Op.like]: `%${productName}%` }
                    }
                }]
            };

            if (productId) queryObject.include = {
                model: SaleProducts,
                as: "saleProducts",
                include: [{
                    model: Product,
                    where: {
                        id: productId
                    }
                }]
            };

            if (id) {
                queryObject.where = {
                    id
                }
            }

            if (createdAt) {
                queryObject.where = {
                    createdAt: {
                        [Op.gte]: moment(createdAt).format("YYYY-MM-DD HH:mm:ss"),
                        [Op.lte]: moment(createdAt).add(1, "days").format("YYYY-MM-DD HH:mm:ss")

                    }
                }
            }

            if (createdAt && operation) {
                if (operation == "gte") {
                    queryObject.where = {
                        createdAt: {
                            [Op.gte]: createdAt
                        }
                    }
                }
                else if (operation == "lte") {
                    queryObject.where = {
                        createdAt: Sequelize.literal(`DATE(saleProducts.createdAt) <= "${createdAt}"`)
                    }
                }
                else if (operation == "eq") {
                    queryObject.where = {
                        createdAt: Sequelize.literal(`DATE(saleProducts.createdAt) = "${createdAt}"`)
                    }
                }
            }

            if (updatedAt) {
                queryObject.where = {
                    updatedAt: {
                        [Op.gte]: moment(updatedAt).format("YYYY-MM-DD HH:mm:ss"),
                        [Op.lte]: moment(updatedAt).add(1, "days").format("YYYY-MM-DD HH:mm:ss")
                    }
                }
            }

            if (group) {
                res.Model = SaleProducts;
                let productWhereStatement = {};
                if (productId) {
                    productWhereStatement.productId = productId;
                }
                if (productName) {
                    productWhereStatement.productName = productName
                }

                queryObject.include = {
                    model: Product,
                    as: "product",
                    where: productWhereStatement
                }
                queryObject.attributes = {
                    include: [
                        [Sequelize.literal("IFNULL(SUM(saleProducts.quantity),0)"), "salesTotal"],
                        [Sequelize.literal("IFNULL(saleProducts.price * SUM(saleProducts.quantity), 0)"), "grossTotalDollars"]
                    ]
                }

                queryObject.group = ["productId"]
            }

            if (from && to) {
                queryObject.where = Sequelize.literal(`DATE(saleProducts.createdAt) BETWEEN "${from}" AND "${to}"`);
            }
            res.queryObject = queryObject;
            next();
        } else {
            res.status(401).json({ err: "Insuficcient permissions" });
        }
    },
    create: async function (req, res) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            let products = req.body.products;

            let sale = await Sales.create({});

            products.forEach(product => {
                sale.addProduct(product.id, {
                    through: {
                        quantity: product.quantity,
                        price: product.price,
                        dolarReference: product.dolarReference,
                        discount: product.discount,
                    }
                })
            })

            res.json(sale);
        }
        else {
            res.status(401).json({ err: "Insuficcient permissions" });
        }
    },
    show: function (req, res) {

    }
}