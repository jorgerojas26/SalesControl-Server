'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class cash extends Model {
        static associate(models) {
            cash.belongsTo(models.payment, {
                as: 'payment',
            });
        }
    }
    cash.init(
        {
            paymentId: DataTypes.INTEGER,
            amount: DataTypes.FLOAT,
            currency: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'cash',
        },
    );
    return cash;
};

