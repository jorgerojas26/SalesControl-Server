'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    static associate(models) {
      Supplier.hasMany(models.Supplying, {
        as: "supplying"
      });
    }
  };
  Supplier.init({
    name: DataTypes.TEXT,
    rif: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Supplier',
  });
  return Supplier;
};