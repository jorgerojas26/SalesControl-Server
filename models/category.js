'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {

    static associate(models) {
      Category.belongsToMany(models.Product, {
        through: "ProductCategories",
        as: "product"
      });
    }
  };
  Category.init({
    name: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Category',
    tableName: "categories"
  });
  return Category;
};