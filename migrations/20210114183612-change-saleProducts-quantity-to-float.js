'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('saleProducts', 'quantity', {
            type: Sequelize.FLOAT,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('saleProducts', 'quantity', {
            type: Sequelize.INTEGER,
        });
    },
};
