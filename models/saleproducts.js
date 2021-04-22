'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SaleProducts extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            SaleProducts.belongsTo(models.Sales, {
                as: 'sales',
                foreignKey: 'saleId',
                sourceKey: 'id'
            });

            SaleProducts.belongsTo(models.Product, {
                as: 'product',
                foreignKey: 'productId',
                sourceKey: 'id',
            });
        }
    }
    SaleProducts.init(
        {
            productId: DataTypes.INTEGER,
            saleId: DataTypes.INTEGER,
            quantity: DataTypes.FLOAT,
            price: DataTypes.FLOAT,
            profitPercent: DataTypes.FLOAT,
            discount: DataTypes.FLOAT,
        },
        {
            sequelize,
            modelName: 'SaleProducts',
            tableName: 'saleproducts',
        },
    );
    /*
        SaleProducts.afterCreate(async (saleproduct, options) => {
            let transaction = options.transaction;
            let product = await sequelize.models.Product.findByPk(saleproduct.dataValues.productId, { transaction });
            product.stock -= saleproduct.dataValues.quantity;
            await product.save({ transaction });
        });
        SaleProducts.afterDestroy(async (saleproduct, options) => {
            let transaction = options.transaction;
            let product = await sequelize.models.Product.findByPk(saleproduct.dataValues.productId, { transaction });
            product.stock += saleproduct.dataValues.quantity;
            await product.save({ transaction });
        });*
        */
    return SaleProducts;
};

