'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("saleproducts", "profitPercent", {
      type: Sequelize.FLOAT,
      allowNull: false,
      after: "dolarReference"
    }).then(() => {
      return queryInterface.sequelize.query("UPDATE saleproducts INNER JOIN products ON saleproducts.productId = products.id SET saleproducts.profitPercent = products.profitPercent");
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("saleproducts", "profitPercent");
  }
};
