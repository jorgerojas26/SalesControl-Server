'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeConstraint("productcategories", "onDeleteCascade");
    } catch (error) {

    }
    await queryInterface.addConstraint("productcategories", {
      fields: ["productId"],
      type: "foreign key",
      name: "onDeleteCascade",
      references: {
        table: "products",
        field: "id"
      },
      onDelete: "CASCADE"
    })

  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeConstraint("productcategories", "onDeleteCascade");
    } catch (error) {

    }
    await queryInterface.addConstraint("productcategories", {
      fields: ["productId"],
      type: "foreign key",
      name: "onDeleteCascade",
      references: {
        table: "products",
        field: "id"
      },
      onDelete: "RESTRICT"
    })
  }
};
