'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Products", "imagePath", {
      type: Sequelize.STRING,
      after: "price"
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Products", "imagePath")
  }
};
