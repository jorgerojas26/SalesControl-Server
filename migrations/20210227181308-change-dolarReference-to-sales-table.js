'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sales', "dolarReference", {
      type: Sequelize.FLOAT,
      allowNull: false
    }).then(async () => {
      await queryInterface.sequelize.query("UPDATE sales INNER JOIN saleproducts ON sales.id = saleproducts.saleId SET sales.dolarReference = saleproducts.dolarReference");
      await queryInterface.removeColumn("saleproducts", "dolarReference");
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sales', "dolarReference");
    await queryInterface.addColumn("saleproducts", "dolarReference", {
      type: Sequelize.FLOAT,
      allowNull: false
    });
  }
};
