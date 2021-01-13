const Payment = require('../models').payment;
const sequelizeModel = require('../models').sequelize;

module.exports = {
    index: async function (req, res, next) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            next();
        } else {
            res.status(401).json({ error: 'Insuficcient permissions' });
        }
    },
    create: async function (req, res) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            let { saleId, paymentMethodId, amount, currency, paymentDetails } = req.body;

            if (saleId && paymentMethodId && amount != null && currency && paymentDetails) {
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
                    if (paymentMethodId == 1) {
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
                                    { include: 'banktransfer' },
                                );
                            }
                        } else {
                            throw 'Incorrect payment details';
                        }
                    } else if (paymentMethodId == 2) {
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
                                    { include: 'pointofsale' },
                                );
                            }
                        } else {
                            throw 'Incorrect payment details';
                        }
                    } else if (paymentMethodId == 3) {
                        if (currency == 'Bs') {
                            newPayment = await Payment.create({
                                saleId,
                                paymentMethodId,
                                amount,
                                currency,
                            });
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
                                    { include: 'cash' },
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
    update: async function (req, res) {},
    delete: async function (req, req) {},
};
