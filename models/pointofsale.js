'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class pointofsale extends Model {
        static associate(models) {
            pointofsale.belongsTo(models.payment, {
                as: 'payment',
            });
        }
    }
    pointofsale.init(
        {
            paymentId: DataTypes.INTEGER,
            ticketId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'pointofsale',
        },
    );
    return pointofsale;
};
