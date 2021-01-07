'use strict';
const { Model } = require('sequelize');
const { roundUpProductPrice } = require('../helpers/products');
module.exports = (sequelize, DataTypes) => {
    class payment extends Model {
        static associate(models) {
            payment.belongsTo(models.paymentmethod, {
                as: 'paymentmethod',
                foreignKey: 'paymentMethodId',
                sourceKey: 'id',
            });
            payment.hasMany(models.pointofsale, {
                as: 'pointofsale',
                foreignKey: 'paymentId',
                sourceKey: 'id',
            });
            payment.hasMany(models.banktransfer, {
                as: 'banktransfer',
                foreignKey: 'paymentId',
                sourceKey: 'id',
            });

            payment.hasMany(models.cash, {
                as: 'cash',
                foreignKey: 'paymentId',
                sourceKey: 'id',
            });
        }
    }
    payment.init(
        {
            saleId: DataTypes.INTEGER,
            paymentMethodId: DataTypes.INTEGER,
            amount: DataTypes.FLOAT,
            currency: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'payment',
        },
    );

    payment.afterCreate(async (payment, options) => {
        let saleId = payment.dataValues.saleId;
        let sale = await sequelize.models.Sales.findByPk(saleId, {
            include: ['saleProducts', 'payment'],
        });

        let invoiceTotal = 0,
            paymentTotal = 0;

        if (sale) {
            sale.saleProducts.forEach(product => {
                invoiceTotal += roundUpProductPrice(product.price * product.dolarReference);
            });

            sale.payment.forEach(payment => {
                paymentTotal += payment.amount;
            });

            if (paymentTotal >= invoiceTotal && !sale.isPaid) {
                sale.isPaid = true;
                sale.save();
            } else {
                sale.isPaid = false;
                sale.save();
            }
        }
    });
    return payment;
};
