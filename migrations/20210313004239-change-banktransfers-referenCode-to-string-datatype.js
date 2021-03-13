'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('banktransfers', "referenceCode", { type: Sequelize.TEXT });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('banktransfers', "referenceCode", { type: Sequelize.TEXT });
  }
};
