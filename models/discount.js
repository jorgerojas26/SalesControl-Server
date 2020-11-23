'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Discount extends Model {
    static associate(models) {
      Discount.belongsTo(models.Product, {
        as: "product",
        foreignKey: "productId"
      })
    }
  };
  Discount.init({
    productId: DataTypes.INTEGER,
    percent: DataTypes.FLOAT,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Discount',
    tableName: "discounts"

  });
  return Discount;
};