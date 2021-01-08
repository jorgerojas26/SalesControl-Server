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
            include: [
                {
                    model: sequelize.models.SaleProducts,
                    as: 'saleProducts',
                    include: ['product'],
                },
                'payment',
            ],
        });
        let currentDolarReference = await sequelize.models.DolarReference.findOne({ order: [['id', 'DESC']], limit: 1 });

        let invoiceTotal = 0,
            paymentTotal = 0;

        if (sale) {
            sale.saleProducts.forEach(saleProduct => {
                invoiceTotal += roundUpProductPrice(saleProduct.product.price * currentDolarReference.price);
            });

            sale.payment.forEach(payment => {
                paymentTotal += payment.amount;
            });

            console.log(invoiceTotal);

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
