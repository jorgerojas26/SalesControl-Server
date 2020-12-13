const Product = require("../models").Product;
const Category = require("../models").Category;
const Supplying = require("../models").Supplying;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const moment = require("moment");

module.exports = {
    index: async function (req, res, next) {

        let { categories, name, id, price, createdAt, updatedAt, from, to } = req.query;
        let queryObject = {};

        queryObject.include = [
            "category",
            "discount"
        ]

        if (id) {
            queryObject.where = {
                id
            }
        }
        if (price) {
            queryObject.where = {
                price
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

        if (updatedAt) {
            queryObject.where = {
                updatedAt: {
                    [Op.gte]: moment(updatedAt).format("YYYY-MM-DD HH:mm:ss"),
                    [Op.lte]: moment(updatedAt).add(1, "days").format("YYYY-MM-DD HH:mm:ss")
                }
            }
        }

        if (categories) {
            queryObject.include = {
                model: Category,
                as: "category",
                where: {
                    id: categories
                }
            }
        }

        if (name) queryObject.where = {
            name: { [Op.like]: `%${name}%` }
        };
        if (from && to) {
            queryObject.where = Sequelize.literal(`DATE(Product.createdAt) BETWEEN "${from}" AND "${to}"`);
        }

        res.queryObject = queryObject;
        next();
    },
    create: async function (req, res) {
        if (req.user.permissions >= process.env.ADMIN_PERMISSION) {
            if (!req.body.name) {
                res.status(409).json({ error: "Por favor ingrese el nombre del producto" });
            }
            else if (!req.body.categories) {
                res.status(409).json({ error: "Por favor ingrese las categorias" })
            }
            else {
                try {
                    let product = await Product.create({
                        name: req.body.name,
                        price: 0,
                        profitPercent: req.body.profitPercent,
                        imagePath: (req.file) ? "\\productImages\\" + req.file.filename : null,
                    });
                    let productWithCategories = await product.addCategory(req.body.categories.split(","));
                    res.status(200).json(productWithCategories);
                } catch (error) {
                    console.log(error);
                    res.status(409).json(error)
                }

            }
        }
        else {
            res.status(401).json({ err: "Insuficcient permissions" });
        }
    },
    update: async function (req, res) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            let { id } = req.params;
            let { name, profitPercent, categories } = req.body;

            if (name && profitPercent && categories) {
                let product = await Product.findOne({
                    include: ["category"],
                    where: { id }
                })
                if (product) {
                    let supplying = await Supplying.findOne({
                        where: {
                            productId: id
                        },
                        order: [["id", "DESC"]],
                    })
                    if (supplying) {
                        if (req.file) {
                            let productUpdated = await Product.update({
                                name,
                                imagePath: "\\productImages\\" + req.file.filename,
                                price: Sequelize.literal(`ROUND(${supplying.price} + (${supplying.price} * (${profitPercent} / 100)), 2)`),
                                profitPercent,
                                categories
                            }, { where: { id } })
                            product.setCategory(req.body.categories.split(","));
                            res.status(200).json(productUpdated)
                        }
                        else {
                            let productUpdated = await Product.update({
                                name,
                                price: Sequelize.literal(`ROUND(${supplying.price} + (${supplying.price} * (${profitPercent} / 100)), 2)`),
                                profitPercent,
                                categories
                            }, { where: { id } })
                            product.setCategory(req.body.categories.split(","));
                            res.status(200).json(productUpdated)
                        }

                    }
                    else {
                        let productUpdated = await Product.update({
                            name,
                            image: (req.file) ? req.file.buffer : null,
                            profitPercent,
                            categories
                        }, { where: { id } })

                        product.setCategory(req.body.categories.split(","));
                        res.status(200).json(productUpdated)
                    }
                }
                else {
                    res.status(404).json({ err: "Product doesn't exist" })
                }
            }
            else {
                res.status(409).json({ err: "No data provided" })
            }
        }
        else {
            res.status(401).json({ err: "Insufficient permissions" })
        }

    },
    destroy: async function (req, res) {
        if (req.user.permissions >= process.env.ADMIN_PERMISSION) {
            let { id } = req.params;
            await Product.destroy({ where: { id } })
            res.sendStatus(204);
        }
        else {
            res.status(401).json({ err: "Insufficient permissions" })
        }
    }
}