'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class payment extends Model {
        static associate(models) {
            payment.belongsTo(models.paymentmethod, {
                as: 'paymentmethod',
            });
            payment.hasMany(models.cash, {
                as: 'cash',
                foreignKey: 'paymentId',
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
        }
    }
    payment.init(
        {
            saleId: DataTypes.INTEGER,
            paymentMethodId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'payment',
        },
    );
    return payment;
};

