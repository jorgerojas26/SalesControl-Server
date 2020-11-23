'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeConstraint("ProductCategories", "onDeleteCascade");
    } catch (error) {

    }
    await queryInterface.addConstraint("ProductCategories", {
      fields: ["productId"],
      type: "foreign key",
      name: "onDeleteCascade",
      references: {
        table: "Products",
        field: "id"
      },
      onDelete: "CASCADE"
    })

  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeConstraint("ProductCategories", "onDeleteCascade");
    } catch (error) {

    }
    await queryInterface.addConstraint("ProductCategories", {
      fields: ["productId"],
      type: "foreign key",
      name: "onDeleteCascade",
      references: {
        table: "Products",
        field: "id"
      },
      onDelete: "RESTRICT"
    })
  }
};
