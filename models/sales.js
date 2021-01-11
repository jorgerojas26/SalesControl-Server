'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Sales extends Model {
        static associate(models) {
            Sales.belongsToMany(models.Product, {
                through: 'saleproducts',
                foreignKey: 'saleId',
                sourceKey: 'id',
            });

            Sales.hasMany(models.SaleProducts, {
                as: 'saleProducts',
                foreignKey: 'saleId',
                sourceKey: 'id',
                onDelete: 'cascade',
            });

            Sales.hasMany(models.payment, {
                as: 'payment',
                foreignKey: 'saleId',
                sourceKey: 'id',
            });
        }
    }
    Sales.init(
        {
            clientId: DataTypes.INTEGER,
            isPaid: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'Sales',
            tableName: 'sales',
        },
    );
    return Sales;
};
