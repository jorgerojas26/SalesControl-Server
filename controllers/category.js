const Category = require("../models").Category;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const moment = require("moment");

module.exports = {
    index: async function (req, res, next) {
        let { id, name, createdAt, updatedAt, from, to } = req.query;

        let queryObject = {};
        if (id) {
            queryObject.where = {
                id
            }
        }
        if (name) {
            queryObject.where = {
                name: { [Op.like]: `%${name}%` }
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
        if (from && to) {
            queryObject.where = Sequelize.literal(`DATE(Categories.createdAt) BETWEEN "${from}" AND "${to}"`);
        }
        res.queryObject = queryObject;
        next();
    },
    create: async function (req, res,) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            if (!req.body.name) {
                res.json({ error: "Por favor ingrese el nombre de la categoría" })
            }
            else {
                let category = await Category.create({
                    name: req.body.name,
                });
                res.json(category);
            }
        }
        else {
            res.status(401).json({ err: "Insuficcient permissions" });
        }
    },
    show: function (req, res, next) {
        let { id } = req.params;
        let queryObject = {};

        queryObject.where = { id }
        next()
    },
    update: async function (req, res) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            let { id } = req.params;
            let { name } = req.body;

            if (name) {
                let category = await Category.update({ name }, { where: { id } })
                res.status(200).json(category)
            }
            else {
                res.status(409).json({ error: "No data provided" })
            }
        }
        else {
            res.status(401).json({ error: "Insufficient permissions" })
        }

    },
    destroy: async function (req, res) {
        if (req.user.permissions >= process.env.ADMIN_PERMISSION) {
            let { id } = req.params;
            await Category.destroy({ where: { id } })
            res.sendStatus(204);
        }
        else {
            res.status(401).json({ error: "Insufficient permissions" })
        }
    }
}