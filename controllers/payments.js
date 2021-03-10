const Payment = require('../models').payment;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    index: async function (req, res, next) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            let queryObject = {};

            let { from, to, createdAt, operation, group } = req.query;

            queryObject.include = ["paymentmethod"];

            if (createdAt && operation) {
                if (operation == 'gte') {
                    queryObject.where = {
                        createdAt: {
                            [Op.gte]: createdAt,
                        },
                    };
                } else if (operation == 'lte') {
                    queryObject.where = {
                        createdAt: Sequelize.literal(`DATE(payment.createdAt) <= "${createdAt}"`),
                    };
                } else if (operation == 'eq') {
                    queryObject.where = {
                        createdAt: Sequelize.literal(`DATE(payment.createdAt) = "${createdAt}"`),
                    };
                }
            }

            if (group) {
                queryObject.group = ["payment.paymentMethodId", "payment.currency"];
                queryObject.attributes = {
                    include: [
                        [Sequelize.literal("SUM(payment.amount)"), "amountTotal"]
                    ],
                };
            }

            if (from && to) {
                queryObject.where = Sequelize.literal(`DATE(payment.createdAt) BETWEEN "${from}" AND "${to}"`);
            }

            res.queryObject = queryObject;

            next();
        } else {
            res.status(401).json({ error: 'Insuficcient permissions' });
        }
    },
    create: async function (req, res) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            let { saleId, paymentMethodId, amount, currency, paymentDetails, fullyPaid } = req.body;

            if (saleId != null && paymentMethodId != null && amount != null && currency != null && paymentDetails) {
                if (amount == 0) {
                    res.status(400).json({ error: "Can't record a payment with amount 0" });
                    return;
                }
                if (currency != 'Bs' && currency != 'USD') {
                    res.status(400).json({ error: 'Invalid currency' });
                    return;
                }
                try {
                    let newPayment = null;
                    if (paymentMethodId == 3) {
                        if (paymentDetails.referenceCode && paymentDetails.bankId) {
                            if (currency != 'Bs') {
                                throw 'Bank transfers must be in Bs currency';
                            } else {
                                newPayment = await Payment.create(
                                    {
                                        saleId,
                                        paymentMethodId,
                                        amount,
                                        currency,
                                        banktransfer: {
                                            referenceCode: paymentDetails.referenceCode,
                                            bankId: paymentDetails.bankId,
                                        },
                                    },
                                    { include: 'banktransfer', fullyPaid },
                                );
                            }
                        } else {
                            throw 'Incorrect payment details';
                        }
                    } else if (paymentMethodId == 1) {
                        if (paymentDetails.ticketId) {
                            if (currency != 'Bs') {
                                throw 'Bank transfers must be in Bs currency';
                            } else {
                                newPayment = await Payment.create(
                                    {
                                        saleId,
                                        paymentMethodId,
                                        amount,
                                        currency,
                                        pointofsale: {
                                            ticketId: paymentDetails.ticketId,
                                        },
                                    },
                                    { include: 'pointofsale', fullyPaid },
                                );
                            }
                        } else {
                            throw 'Incorrect payment details';
                        }
                    } else if (paymentMethodId == 2) {
                        if (currency == 'Bs') {
                            newPayment = await Payment.create({
                                saleId,
                                paymentMethodId,
                                amount,
                                currency,
                            }, { fullyPaid });
                        } else if (currency == 'USD') {
                            if (paymentDetails.dolarReference) {
                                newPayment = await Payment.create(
                                    {
                                        saleId,
                                        paymentMethodId,
                                        amount,
                                        currency,
                                        cash: {
                                            dolarReference: paymentDetails.dolarReference,
                                        },
                                    },
                                    { include: 'cash', fullyPaid },
                                );
                            } else {
                                throw 'Incorrect payment details';
                            }
                        } else {
                            throw 'Incorrect currency';
                        }
                    } else {
                        throw 'Invalid payment method';
                    }
                    res.status(200).json(newPayment);
                } catch (error) {
                    res.status(404).json({ error });
                }
            } else {
                res.status(400).json({ error: 'Empty fields' });
            }
        } else {
            res.status(401).json({ error: 'Insuficcient permissions' });
        }
    },
    update: async function (req, res) { },
    delete: async function (req, req) { },
};
