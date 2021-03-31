const Supplying = require("../models").Supplying;
const Supplier = require("../models").Supplier;
const Product = require("../models").Product;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const moment = require("moment");
module.exports = {
    index: function (req, res, next) {
        let { id, supplierId, supplierName, productId, productName, price, quantity, createdAt, updatedAt, from, to, operation, group } = req.query;
        let queryObject = {};

        queryObject.include = [
            "supplier",
            "product"
        ];
        queryObject.order = [["createdAt", "DESC"]];


        if (id) {
            queryObject.where = {
                id
            };
        }
        if (supplierId) {
            queryObject.include = [
                {
                    model: Supplier,
                    as: "supplier",
                    where: {
                        id: supplierId
                    }
                },
                {
                    model: Product,
                    as: "product"
                }
            ];
        }
        if (supplierName) {
            queryObject.include = [
                {
                    model: Supplier,
                    as: "supplier",
                    where: {
                        name: { [Op.like]: `%${supplierName}%` }
                    }
                },
                {
                    model: Product,
                    as: "product"
                }
            ];
        }
        if (productId) {
            queryObject.include = [
                {
                    model: Supplier,
                    as: "supplier",

                },
                {
                    model: Product,
                    as: "product",
                    where: {
                        id: productId
                    }
                }
            ];
        }
        if (productName) {
            queryObject.include = [
                {
                    model: Supplier,
                    as: "supplier",

                },
                {
                    model: Product,
                    as: "product",
                    where: {
                        name: { [Op.like]: `%${productName}%` }
                    }
                }
            ];
        }
        if (price) {
            queryObject.where = {
                price
            };
        }
        if (quantity) {
            queryObject.where = {
                quantity
            };
        }

        if (createdAt) {
            queryObject.where = {
                createdAt: {
                    [Op.gte]: moment(createdAt).format("YYYY-MM-DD HH:mm:ss"),
                    [Op.lte]: moment(createdAt).add(1, "days").format("YYYY-MM-DD HH:mm:ss")

                }
            };
        }
        if (createdAt && operation) {
            if (operation == "gte") {
                queryObject.where = {
                    createdAt: {
                        [Op.gte]: createdAt
                    }
                };
            }
            else if (operation == "lte") {
                queryObject.where = {
                    createdAt: Sequelize.literal(`DATE(Supplying.createdAt) <= "${createdAt}"`)
                };
            }
        }

        if (updatedAt) {
            queryObject.where = {
                updatedAt: {
                    [Op.gte]: moment(updatedAt).format("YYYY-MM-DD HH:mm:ss"),
                    [Op.lte]: moment(updatedAt).add(1, "days").format("YYYY-MM-DD HH:mm:ss")
                }
            };
        }
        if (from && to) {
            queryObject.where = Sequelize.literal(`DATE(Supplying.createdAt) BETWEEN "${from}" AND "${to}"`);
        }

        if (group) {
            queryObject.attributes = {
                include: [
                    [Sequelize.fn("SUM", Sequelize.col("quantity")), "quantity"],
                    [Sequelize.literal("SUM(`Supplying`.`price` * `Supplying`.`quantity`)"), "grossTotalDollars"],
                    [Sequelize.literal("SUM(`Supplying`.`price` * `Supplying`.`quantity`) * Supplying.dolarReference"), "grossTotalBs"]

                ],
                exclude: ["quantity"]
            };
            queryObject.group = ["product.id"];
        }
        res.queryObject = queryObject;
        next();
    },
    create: async function (req, res) {
        if (req.user.permissions >= process.env.ADMIN_PERMISSION) {
            let supplying = await Supplying.create({
                supplierId: req.body.supplierId,
                productId: req.body.productId,
                price: req.body.price,
                dolarReference: req.body.dolarReference,
                quantity: req.body.quantity
            });
            res.status(200).json(supplying);
        } else {
            res.status(401).json({ err: "Insuficcient permissions" });
        }

    },
    destroy: async function (req, res) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            let { id } = req.params;
            let supplying = await Supplying.findByPk(id);
            await supplying.destroy();
            res.sendStatus(204);
        }
        else {
            res.status(401).json({ err: "Insufficient permissions" });
        }
    }
};