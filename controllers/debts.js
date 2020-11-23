const Debts = require("../models").Debt;
const Client = require("../models").Client;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const moment = require("moment");

module.exports = {
    index: async function (req, res, next) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            let { id, clientId, name, cedula, phoneNumber, type, cancelled, createdAt, updatedAt, from, to } = req.query;

            let queryObject = {};

            queryObject.include =
            {
                model: Client,
                as: "client"
            }

            if (id) {
                queryObject.where = { id }
            }

            if (type) {
                queryObject.where = { type }
            }

            if (cancelled) {
                queryObject.where = { cancelled }
            }

            if (clientId) {
                queryObject.include.where = { id: clientId }
            }

            if (name) {
                queryObject.include.where = {
                    name: { [Op.like]: `%${name}%` }
                }
            }
            if (cedula) {
                queryObject.include.where = {
                    cedula: { [Op.like]: `${cedula}%` }
                }
            }
            if (phoneNumber) {
                queryObject.include.where = {
                    phoneNumber: { [Op.like]: `${phoneNumber}%` }
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
                queryObject.where = Sequelize.literal(`DATE(Debts.createdAt) BETWEEN "${from}" AND "${to}"`);
            }

            queryObject.order = [["createdAt", "DESC"]]
            res.queryObject = queryObject;

            next();
        } else {
            res.status(401).json({ error: "Insuficcient permissions" });
        }
    },
    create: async function (req, res) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {

            let { clientId, type, total } = req.body;
            if (clientId != null && type != null && total != null) {
                try {
                    let debt = await Debts.create({
                        clientId: req.body.clientId,
                        type: req.body.type,
                        total: req.body.total,
                        cancelled: false
                    });
                    res.status(200).json(debt)
                } catch (error) {
                    res.json({ error })
                }
            }
            else {
                res.json({ error: "No data provided" })
            }


        } else {
            res.status(401).json({ error: "Insuficcient permissions" });
        }
    },
    update: async function (req, res) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {

            let { id } = req.params;
            let { clientId, type, total, cancelled } = req.body;
            console.log(req.body);
            if (clientId != null && type != null && total != null && cancelled != null) {
                try {
                    let debt = await Debts.update({
                        clientId,
                        type,
                        total,
                        cancelled
                    }, { where: { id } })
                    res.status(200).json(debt);
                } catch (error) {
                    res.json({ error })
                }
            }
            else {
                res.status(409).json({ error: "No data provided" })
            }
        }
        else {
            res.status(401).json({ error: "Insufficient permissions" })
        }

    },
}