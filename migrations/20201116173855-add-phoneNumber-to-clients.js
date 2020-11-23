'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Clients", "phoneNumber", {
      type: Sequelize.STRING,
      after: "cedula"
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Clients", "phoneNumber");
  }
};
