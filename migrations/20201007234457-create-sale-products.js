'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('saleproducts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      saleId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
      },
      quantity: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      price: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      dolarReference: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      discount: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('saleproducts');
  }
};
