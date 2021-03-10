'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('supplyings', 'quantity', {
      type: Sequelize.FLOAT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('supplyings', 'quantity', {
      type: Sequelize.INTEGER,
    });
  },
};