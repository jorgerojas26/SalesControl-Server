'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('products', "stock", {
        type: Sequelize.FLOAT,
        allowNull: false,
        after: "profitPercent"
      })
        .then(async () => {
          await queryInterface.sequelize.query(`
        UPDATE products as products,
        (SELECT productId, SUM(quantity) as quantity FROM saleproducts GROUP BY productId) as salesTotal,
        (SELECT productId, SUM(quantity) as quantity FROM supplyings GROUP BY productId) as supplyingsTotal
        SET stock = (select supplyingsTotal.quantity) - (select salesTotal.quantity)
        WHERE salesTotal.productId = id
        AND supplyingsTotal.productId = id
        `);
        });
    } catch (error) {
      await queryInterface.removeColumn('products', "stock");
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('products', "stock");
  }
};
