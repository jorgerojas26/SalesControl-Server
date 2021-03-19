const Sales = require('../models').Sales;
const SaleProducts = require('../models').SaleProducts;
const Product = require('../models').Product;
const Payment = require("../models").payment;
const Client = require('../models').Client;
const PaymentMethod = require('../models').paymentmethod;
const sequelizeModel = require('../models').sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const moment = require('moment');

module.exports = {
    index: function (req, res, next) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            let { productName, productId, id, createdAt, updatedAt, from, to, operation, group, debtsOnly, clientName } = req.query;
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
                {
                    model: Payment,
                    as: "payment",
                    include: ["paymentmethod", "pointofsale", "cash", "banktransfer"]
                },
                {
                    model: Client,
                    as: "client",
                    where: {
                        name: { [Op.like]: `%${clientName || ""}%` }
                    }

                }
            ];
            queryObject.order = [['createdAt', 'DESC']];

            if (productName) {
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
            }

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

                queryObject.include = [
                    {
                        model: Product,
                        as: 'product',
                        where: productWhereStatement,
                    },
                    {
                        model: Sales,
                        as: "sales"
                    }
                ];

                queryObject.attributes = {
                    include: [
                        [Sequelize.literal('IFNULL(SUM(ROUND(SaleProducts.quantity, 3)),0)'), 'salesTotal'],
                        [Sequelize.literal('IFNULL(SaleProducts.price * SUM(SaleProducts.quantity), 0)'), 'grossTotalDollars'],
                        [Sequelize.literal('IFNULL(SaleProducts.price * SUM(SaleProducts.quantity), 0) * IFNULL(SaleProducts.profitPercent / 100, 0)'), 'netIncomeDollars'],
                    ],
                };

                queryObject.group = ['productId'];
            }

            if (from && to) {
                queryObject.where = Sequelize.literal(`DATE(SaleProducts.createdAt) BETWEEN "${from}" AND "${to}"`);
            }

            if (debtsOnly) {
                queryObject.where = {
                    isPaid: 0
                };
            }
            res.queryObject = queryObject;
            next();
        } else {
            res.status(401).json({ err: 'Insuficcient permissions' });
        }
    },
    create: async function (req, res) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            let { products, clientId, isPaid, payments, fullyPaidDate, dolarReference } = req.body;

            if (products && clientId && isPaid != null && dolarReference != null && payments) {
                let allPaymentsActive = true;
                for (let payment of payments) {
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
                        const result = await sequelizeModel.transaction(async t => {
                            const sale = await Sales.create(
                                {
                                    clientId,
                                    isPaid,
                                    fullyPaidDate: isPaid ? fullyPaidDate : null,
                                    dolarReference
                                },
                                { transaction: t },
                            );
                            for (product of products) {
                                await sale.createSaleProduct(
                                    {
                                        productId: product.id,
                                        quantity: product.quantity,
                                        price: product.price,
                                        profitPercent: product.profitPercent,
                                        discount: product.discount,
                                    },
                                    {
                                        transaction: t,
                                    },
                                );
                            }

                            for (let payment of payments) {
                                if (payment.paymentMethodId != null && payment.amount != null && payment.currency && payment.paymentDetails) {
                                    if (payment.amount > 0) {
                                        let paymentDetails = payment.paymentDetails;
                                        if (payment.paymentMethodId == 1) {
                                            if (paymentDetails.ticketId) {
                                                if (payment.currency != 'Bs') {
                                                    throw 'Point of Sales must be in Bs currency';
                                                } else {
                                                    let pm = {
                                                        paymentMethodId: payment.paymentMethodId,
                                                        amount: payment.amount,
                                                        currency: payment.currency,
                                                        pointofsale: {
                                                            ticketId: paymentDetails.ticketId,
                                                        }
                                                    };
                                                    await sale.createPayment(pm, { transaction: t, include: 'pointofsale' },);
                                                    if (payment.payingDebtInfo) {
                                                        for (let debtInfo of payment.payingDebtInfo) {
                                                            await Payment.create({
                                                                ...pm,
                                                                amount: debtInfo.amount,
                                                                saleId: debtInfo.saleId,
                                                            }, {
                                                                transaction: t, include: "pointofsale", fullyPaid: debtInfo.fullyPaid
                                                            });

                                                        }
                                                    }
                                                }
                                            } else {
                                                throw 'Incorrect payment details for Point of Sales';
                                            }
                                        }
                                        else if (payment.paymentMethodId == 2) {
                                            if (payment.currency == 'Bs') {
                                                await sale.createPayment(payment, { transaction: t });
                                                if (payment.payingDebtInfo) {
                                                    for (let debtInfo of payment.payingDebtInfo) {
                                                        await Payment.create({
                                                            ...payment,
                                                            amount: debtInfo.amount,
                                                            saleId: debtInfo.saleId,
                                                        }, {
                                                            transaction: t, include: "cash", fullyPaid: debtInfo.fullyPaid
                                                        });


                                                    }
                                                }
                                            } else if (payment.currency == 'USD') {
                                                if (paymentDetails.dolarReference) {
                                                    let pm = {
                                                        paymentMethodId: payment.paymentMethodId,
                                                        amount: payment.amount,
                                                        currency: payment.currency,
                                                        cash: {
                                                            dolarReference: paymentDetails.dolarReference,
                                                        }
                                                    };
                                                    await sale.createPayment(pm, { transaction: t, include: 'cash' },);
                                                    if (payment.payingDebtInfo) {
                                                        for (let debtInfo of payment.payingDebtInfo) {
                                                            await Payment.create({
                                                                ...pm,
                                                                amount: debtInfo.amount,
                                                                saleId: debtInfo.saleId,
                                                            }, {
                                                                transaction: t, include: "cash", fullyPaid: debtInfo.fullyPaid
                                                            });


                                                        }
                                                    }
                                                } else {
                                                    throw 'Incorrect payment details for Cash';
                                                }
                                            } else {
                                                throw 'Incorrect currency';
                                            }
                                        }
                                        else if (payment.paymentMethodId == 3) {
                                            if (paymentDetails.referenceCode && paymentDetails.bankId) {
                                                if (payment.currency != 'Bs') {
                                                    throw 'Bank transfers must be in Bs currency';
                                                } else {
                                                    let pm = {
                                                        paymentMethodId: payment.paymentMethodId,
                                                        amount: payment.amount,
                                                        currency: payment.currency,
                                                        banktransfer: {
                                                            referenceCode: paymentDetails.referenceCode,
                                                            bankId: paymentDetails.bankId,
                                                        }
                                                    };
                                                    await sale.createPayment(pm, { transaction: t, include: 'banktransfer' });
                                                    if (payment.payingDebtInfo) {
                                                        for (let debtInfo of payment.payingDebtInfo) {
                                                            await Payment.create({
                                                                ...pm,
                                                                amount: debtInfo.amount,
                                                                saleId: debtInfo.saleId,
                                                            }, {
                                                                transaction: t, include: "banktransfer", fullyPaid: debtInfo.fullyPaid
                                                            });

                                                        }
                                                    }
                                                }
                                            } else {
                                                throw 'Incorrect payment details for Bank Transfer';
                                            }
                                        }
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
    update: async function (req, res) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            let { clientId, isPaid } = req.body;
            let { id } = req.params;

            if (clientId != null && isPaid != null) {
                try {
                    let sale = await Sales.findByPk(id);
                    if (!sale) {
                        res.status(404).json({ error: 'Sale not found' });
                        return;
                    }
                    sale.clientId = clientId;
                    sale.isPaid = isPaid;
                    let updatedSale = await sale.save();
                    res.status(200).json(updatedSale);
                } catch (error) {
                    res.status(400).json({ error });
                }
            } else {
                res.status(400).json({ error: 'Empty fields' });
            }
        } else {
            res.status(401).json({ error: 'Insuficcient permissions' });
        }
    },
    destroy: async function (req, res) {
        // res.status(401).json({ error: 'No permitido' });
        if (req.user.permissions >= process.env.MASTER_PERMISSION) {
            let { id } = req.params;
            await Sales.destroy({ where: { id } });
            res.sendStatus(204);
        } else {
            res.status(401).json({ error: 'Insufficient permissions' });
        }
    },
};
