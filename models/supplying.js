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
    quantity: DataTypes.FLOAT,
    price: DataTypes.FLOAT,
    dolarReference: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Supplying',
    tableName: "supplyings"
  });

  /*
  Supplying.afterCreate(async (supplying, options) => {
    let product = await sequelize.models.Product.findByPk(supplying.dataValues.productId);
    supplying.price = parseFloat(supplying.price);
    product.price = (supplying.price + (supplying.price * (product.profitPercent / 100))).toFixed(2);
    product.stock += parseFloat(supplying.dataValues.quantity);
    product.save();
  });

  Supplying.afterDestroy(async (supplying, options) => {
    let product = await sequelize.models.Product.findByPk(supplying.dataValues.productId);
    product.stock -= parseFloat(supplying.dataValues.quantity);
    product.save();

  });
  */
  return Supplying;
};
