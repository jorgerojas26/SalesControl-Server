'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeConstraint("ProductCategories", "onDeleteCascade");
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
    } catch (error) {

    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("ProductCategories", "onDeleteCascade");
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
