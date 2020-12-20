'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class banktransfer extends Model {
        static associate(models) {
            banktransfer.belongsTo(models.payment, {
                as: 'payment',
            });
        }
    }
    banktransfer.init(
        {
            paymentId: DataTypes.INTEGER,
            referenceCod: DataTypes.INTEGER,
            amount: DataTypes.FLOAT,
            bankId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'banktransfer',
        },
    );
    return banktransfer;
};

