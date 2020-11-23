'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DolarReference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DolarReference.init({
    price: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'DolarReference',
    tableName: "dolarreferences"
  });
  return DolarReference;
};