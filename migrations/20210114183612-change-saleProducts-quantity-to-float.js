'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('saleproducts', 'quantity', {
      type: Sequelize.FLOAT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('saleproducts', 'quantity', {
      type: Sequelize.INTEGER,
    });
  },
};
