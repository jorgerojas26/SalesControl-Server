'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class banktransfer extends Model {
        static associate(models) {
            banktransfer.belongsTo(models.payment, {
                as: 'payment',
            });

            banktransfer.belongsTo(models.bank, {
                as: 'bank',
            });
        }
    }
    banktransfer.init(
        {
            paymentId: DataTypes.INTEGER,
            referenceCod: DataTypes.INTEGER,
            bankId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'banktransfer',
        },
    );
    return banktransfer;
};
