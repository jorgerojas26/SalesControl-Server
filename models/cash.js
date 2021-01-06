'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class cash extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    cash.init(
        {
            paymentId: DataTypes.INTEGER,
            dolarReference: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'cash',
        },
    );
    return cash;
};

