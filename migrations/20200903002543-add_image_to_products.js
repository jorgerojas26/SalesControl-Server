'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("products", "imagePath", {
      type: Sequelize.STRING,
      after: "price"
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("products", "imagePath")
  }
};
