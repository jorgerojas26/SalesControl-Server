'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("sales", "fullyPaidDate", {
      type: Sequelize.DATE,
      allowNull: true
    }).then(() => {
      return queryInterface.sequelize.query("UPDATE sales SET sales.fullyPaidDate = sales.createdAt");
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("sales", "fullyPaidDate");
  }
};
