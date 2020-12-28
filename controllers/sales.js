const Sales = require('../models').Sales;
const SaleProducts = require('../models').SaleProducts;
const Product = require('../models').Product;
const PaymentMethod = require('../models').paymentmethod;
const sequelize = require('../models').sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const moment = require('moment');

module.exports = {
    index: function (req, res, next) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            let { productName, productId, id, createdAt, updatedAt, from, to, operation, group } = req.query;
            let queryObject = {};

            res.Model = Sales;

            queryObject.include = [
                {
                    model: SaleProducts,
                    as: 'saleProducts',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                        },
                    ],
                    group: ['id'],
                },
                'payment',
            ];
            queryObject.order = [['createdAt', 'DESC']];

            if (productName)
                queryObject.include = {
                    model: SaleProducts,
                    as: 'saleProducts',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            //separate: true
                        },
                    ],
                    where: {
                        productId: {
                            [Op.in]: Sequelize.literal(`(SELECT id FROM Products WHERE Products.name LIKE '%${productName}%' GROUP BY id HAVING count(id) = 1)`),
                        },
                    },
                };

            if (productId)
                queryObject.include = {
                    model: SaleProducts,
                    as: 'saleProducts',
                    include: [
                        {
                            model: Product,
                            where: {
                                id: productId,
                            },
                        },
                    ],
                };

            if (id) {
                queryObject.where = {
                    id,
                };
            }

            if (createdAt) {
                queryObject.where = {
                    createdAt: Sequelize.literal(`DATE(Sales.createdAt) = "${createdAt}"`),
                };
            }

            if (createdAt && operation) {
                if (operation == 'gte') {
                    queryObject.where = {
                        createdAt: {
                            [Op.gte]: createdAt,
                        },
                    };
                } else if (operation == 'lte') {
                    queryObject.where = {
                        createdAt: Sequelize.literal(`DATE(SaleProducts.createdAt) <= "${createdAt}"`),
                    };
                } else if (operation == 'eq') {
                    queryObject.where = {
                        createdAt: Sequelize.literal(`DATE(SaleProducts.createdAt) = "${createdAt}"`),
                    };
                }
            }

            if (updatedAt) {
                queryObject.where = {
                    updatedAt: Sequelize.literal(`DATE(Sales.updatedAt) = "${createdAt}"`),
                };
            }

            if (group) {
                res.Model = SaleProducts;
                let productWhereStatement = {};

                if (productId) {
                    productWhereStatement.id = productId;
                }
                if (productName) {
                    productWhereStatement.name = { [Op.like]: `%${productName}%` };
                }

                queryObject.include = {
                    model: Product,
                    as: 'product',
                    where: productWhereStatement,
                };
                queryObject.attributes = {
                    include: [
                        [Sequelize.literal('IFNULL(SUM(SaleProducts.quantity),0)'), 'salesTotal'],
                        [Sequelize.literal('IFNULL(SaleProducts.price * SUM(SaleProducts.quantity), 0)'), 'grossTotalDollars'],
                    ],
                };

                queryObject.group = ['productId'];
            }

            if (from && to) {
                queryObject.where = Sequelize.literal(`DATE(SaleProducts.createdAt) BETWEEN "${from}" AND "${to}"`);
            }
            res.queryObject = queryObject;
            next();
        } else {
            res.status(401).json({ err: 'Insuficcient permissions' });
        }
    },
    create: async function (req, res) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            let { products, clientId, isPaid, payments } = req.body;

            if (products && clientId && isPaid && payments) {
                let allPaymentsActive = true;
                for (payment of payments) {
                    let paymentMethod = await PaymentMethod.findByPk(payment.paymentMethodId);
                    if (!paymentMethod) {
                        res.status(404).json({ error: 'Payment Method Not Found' });
                        return;
                    } else {
                        if (!paymentMethod.isActive) {
                            res.status(409).json({ error: 'El método de pago ' + paymentMethod.name + ' se encuentra inactivo' });
                            return;
                        }
                    }
                }
                if (allPaymentsActive) {
                    try {
                        const result = await sequelize.transaction(async t => {
                            const sale = await Sales.create(
                                {
                                    clientId,
                                    isPaid,
                                },
                                { transaction: t },
                            );
                            for (product of products) {
                                await sale.addProduct(product.id, {
                                    through: {
                                        quantity: product.quantity,
                                        price: product.price,
                                        dolarReference: product.dolarReference,
                                        discount: product.discount,
                                    },
                                    transaction: t,
                                });
                            }

                            for (payment of payments) {
                                if (payment.paymentMethodId && payment.amount && payment.currency && payment.paymentDetails) {
                                    let paymentDetails = payment.paymentDetails;
                                    switch (payment.paymentMethodId) {
                                        case 1:
                                            if (paymentDetails.referenceCode && paymentDetails.bankId) {
                                                let newPayment = await sale.createPayment(
                                                    {
                                                        ...payment,
                                                        banktransfer: {
                                                            referenceCode: paymentDetails.referenceCode,
                                                            bankId: paymentDetails.bankId,
                                                        },
                                                    },
                                                    { transaction: t, include: 'banktransfer' },
                                                );
                                            } else {
                                                throw 'Incorrect payment details';
                                            }
                                            break;
                                        case 2:
                                            if (paymentDetails.ticketId) {
                                                let newPayment = await sale.createPayment(
                                                    {
                                                        ...payment,
                                                        pointofsale: {
                                                            ticketId: paymentDetails.ticketId,
                                                        },
                                                    },
                                                    { transaction: t, include: 'pointofsale' },
                                                );
                                            } else {
                                                throw 'Incorrect payment details';
                                            }
                                            break;
                                        case 3:
                                            if (paymentDetails) {
                                                let newPayment = await sale.createPayment(payment, { transaction: t });
                                            } else {
                                                throw 'Incorrect payment details';
                                            }

                                            break;
                                    }
                                } else {
                                    throw 'Incorrect payment info';
                                }
                            }

                            return sale;
                        });
                        res.status(200).json(result);
                    } catch (error) {
                        console.log(error);
                        res.status(404).json({ error });
                    }
                }
            } else {
                res.status(400).json({ error: 'Empty fields' });
            }
        } else {
            res.status(401).json({ error: 'Insuficcient permissions' });
        }
    },
    destroy: async function (req, res) {
        if (req.user.permissions >= process.env.MASTER_PERMISSION) {
            let { id } = req.params;
            await Sales.destroy({ where: { id } });
            res.sendStatus(204);
        } else {
            res.status(401).json({ error: 'Insufficient permissions' });
        }
    },
};
