'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class bank extends Model {
        static associate(models) {
            bank.hasMany(models.banktransfer, {
                as: 'banktransfer',
                foreignKey: 'bankId',
                sourceKey: 'id',
            });
        }
    }
    bank.init(
        {
            bankName: DataTypes.TEXT,
            accountNumber: DataTypes.TEXT,
            ownerDocNumber: DataTypes.TEXT,
            accountType: DataTypes.TEXT,
            ownerName: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'bank',
        },
    );
    return bank;
};
