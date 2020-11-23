'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Supplying extends Model {

    static associate(models) {

      Supplying.belongsTo(models.Product, {
        as: "product",
        foreignKey: "productId"
      });
      Supplying.belongsTo(models.Supplier, {
        as: "supplier"
      });
    }
  };
  Supplying.init({
    supplierId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    dolarReference: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Supplying',
    tableName: "supplyings"
  });

  Supplying.afterCreate(async (supplying, options) => {
    sequelize.models.Product.update({
      price: sequelize.literal(`ROUND(${supplying.price} + (${supplying.price} * (profitPercent / 100)), 2)`)
    }, {
      where: {
        id: supplying.dataValues.productId
      }
    })
  })
  Supplying.afterDestroy(async (supplying, options) => {

    sequelize.models.Product.update({
      price: sequelize.literal(`ROUND(${supplying.price} + (${supplying.price} * (profitPercent / 100)), 2)`)
    }, {
      where: {
        id: supplying.dataValues.productId
      }
    })

  })
  return Supplying;
};