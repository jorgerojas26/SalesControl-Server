'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Debt extends Model {
    static associate(models) {
      Debt.belongsTo(models.Client, {
        as: 'client',
      });
    }
  }
  Debt.init(
    {
      clientId: DataTypes.INTEGER,
      type: DataTypes.TINYINT,
      total: DataTypes.FLOAT,
      cancelled: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Debt',
      tableName: 'debts',
    },
  );
  return Debt;
};

