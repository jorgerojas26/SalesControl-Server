'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.renameColumn("Products", "imagePath", "image");
    } catch (error) {

    }
    await queryInterface.changeColumn('Products', 'image', {
      type: Sequelize.BLOB("long"),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.renameColumn("Products", "image", "imagePath");
    } catch (error) {

    } await queryInterface.changeColumn('Products', 'imagePath', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  }
};
