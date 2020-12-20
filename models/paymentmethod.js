'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class paymentmethod extends Model {
        static associate(models) {
            paymentmethod.hasMany(models.payment, {
                foreignKey: 'paymentmethodId',
                sourceKey: 'id',
            });
        }
    }
    paymentmethod.init(
        {
            name: DataTypes.TEXT,
            isActive: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'paymentmethod',
        },
    );
    return paymentmethod;
};

