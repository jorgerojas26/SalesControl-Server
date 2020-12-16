'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("clients", "phoneNumber", {
      type: Sequelize.STRING,
      after: "cedula"
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("clients", "phoneNumber");
  }
};
