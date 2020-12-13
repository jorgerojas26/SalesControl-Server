const Supplier = require("../models").Supplier;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const moment = require("moment");

module.exports = {
    index: function (req, res, next) {
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
            queryObject.where = Sequelize.literal(`DATE(Supplier.createdAt) BETWEEN "${from}" AND "${to}"`);
        }
        res.queryObject = queryObject;
        next();
    },
    create: async function (req, res) {
        if (req.user.permissions >= process.env.ADMIN_PERMISSION) {
            let supplier = await Supplier.create({
                name: req.body.name,
                rif: req.body.rif
            });

            res.status(200).json(supplier);
        } else {
            res.status(401).json({ err: "Insuficcient permissions" });
        }

    },
    show: function (req, res) {

    }
}