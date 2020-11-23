'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {

    static associate(models) {
      Product.belongsToMany(models.Category, {
        through: "ProductCategories",
        as: "category",
        onDelete: "CASCADE"
      });
      Product.hasMany(models.Supplying, {
        as: "supplying",
        foreignKey: "productId",
        sourceKey: "id"
      });

      Product.hasMany(models.Discount, {
        as: "discount",
        foreignKey: "productId",
        sourceKey: "id"
      })

      Product.belongsToMany(models.Sales, {
        through: "SaleProducts",
        foreignKey: "productId",
        sourceKey: "id"
      });

      Product.hasMany(models.SaleProducts, {
        as: "saleProducts",
        foreignKey: "productId",
        sourceKey: "id"
      })
    }
  };
  Product.init({
    name: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    profitPercent: DataTypes.FLOAT,
    image: DataTypes.BLOB("long")
  }, {
    sequelize,
    modelName: 'Product',
    tableName: "products"
  });

  return Product;
};