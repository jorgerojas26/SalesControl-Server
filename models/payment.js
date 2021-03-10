'use strict';
const { Model } = require('sequelize');
const { roundUpProductPrice } = require('../helpers/products');
const { calculateSaleTotal, calculatePaymentsTotal } = require("../helpers/sales");
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
                onDelete: "CASCADE"
            });
            payment.hasMany(models.banktransfer, {
                as: 'banktransfer',
                foreignKey: 'paymentId',
                sourceKey: 'id',
                onDelete: "CASCADE"
            });

            payment.hasMany(models.cash, {
                as: 'cash',
                foreignKey: 'paymentId',
                sourceKey: 'id',
                onDelete: "CASCADE"
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

    payment.beforeCreate(async (payment, options) => {
        console.log("fullyPAIDDDDDDDDDDDDDDDD", options.fullyPaid);
        console.log(options);
        let saleId = payment.dataValues.saleId;
        let sale = await sequelize.models.Sales.findByPk(saleId, {
            include: [
                {
                    model: sequelize.models.SaleProducts,
                    as: 'saleProducts',
                    include: ['product'],
                },
                {
                    model: sequelize.models.payment,
                    as: 'payment',
                    include: { all: true },
                },
            ],
        });
        if (options.fullyPaid == 1) {
            sale.isPaid = true;
            sale.fullyPaidDate = new Date();
            sale.save();
        }
    });
    return payment;
};
