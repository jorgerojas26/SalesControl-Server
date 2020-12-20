'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sales', 'clientId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: 'id',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sales', 'clientId');
  },
};
