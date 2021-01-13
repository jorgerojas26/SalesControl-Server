const Clients = require('../models').Client;
const Sales = require('../models').Sales;
const SaleProducts = require('../models').SaleProducts;
const Payment = require('../models').payment;
const BankTransfer = require('../models').banktransfer;
const Cash = require('../models').cash;
const PointOfSale = require('../models').pointofsale;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const moment = require('moment');

module.exports = {
    index: async function (req, res, next) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            let { id, name, cedula, createdAt, updatedAt, from, to, withDebts, nameOrCedula } = req.query;

            let queryObject = {};

            if (id) {
                queryObject.where = {
                    id,
                };
            }

            if (name) {
                queryObject.where = {
                    name: { [Op.like]: `%${name}%` },
                };
            }
            if (nameOrCedula) {
                queryObject.where = {
                    [Op.or]: [
                        {
                            name: { [Op.like]: `%${nameOrCedula}%` },
                        },
                        {
                            cedula: { [Op.like]: `%${nameOrCedula}%` },
                        },
                    ],
                };
            }
            if (withDebts) {
                queryObject.include = [
                    {
                        model: Sales,
                        as: 'sales',
                        where: {
                            isPaid: 0,
                        },
                        include: [
                            {
                                model: SaleProducts,
                                as: 'saleProducts',
                                include: ['product'],
                            },
                            {
                                model: Payment,
                                as: 'payment',
                                include: { all: true },
                            },
                        ],
                        separate: true,
                    },
                ];
            }

            if (cedula) {
                queryObject.where = {
                    cedula: { [Op.like]: `${cedula}%` },
                };
            }

            if (createdAt) {
                queryObject.where = {
                    createdAt: {
                        [Op.gte]: moment(createdAt).format('YYYY-MM-DD HH:mm:ss'),
                        [Op.lte]: moment(createdAt).add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
                    },
                };
            }

            if (updatedAt) {
                queryObject.where = {
                    updatedAt: {
                        [Op.gte]: moment(updatedAt).format('YYYY-MM-DD HH:mm:ss'),
                        [Op.lte]: moment(updatedAt).add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
                    },
                };
            }
            if (from && to) {
                queryObject.where = Sequelize.literal(`DATE(Clients.createdAt) BETWEEN "${from}" AND "${to}"`);
            }
            res.queryObject = queryObject;
            next();
        } else {
            res.status(401).json({ err: 'Insuficcient permissions' });
        }
    },
    create: async function (req, res) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            try {
                let client = await Clients.create({
                    name: req.body.name,
                    cedula: req.body.cedula,
                    phoneNumber: req.body.phoneNumber,
                });
                res.status(200).json(client);
            } catch (error) {
                res.json({ error });
            }
        } else {
            res.status(401).json({ err: 'Insuficcient permissions' });
        }
    },
    update: async function (req, res) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            let { id } = req.params;
            let { name, cedula, phoneNumber } = req.body;

            if (name != null && cedula != null && phoneNumber != null) {
                let client = await Clients.update(
                    {
                        name,
                        cedula,
                        phoneNumber,
                    },
                    { where: { id } },
                );
                res.status(200).json(client);
            } else {
                res.status(409).json({ error: 'No data provided' });
            }
        } else {
            res.status(401).json({ error: 'Insufficient permissions' });
        }
    },
    show: function (req, res) {},
};
