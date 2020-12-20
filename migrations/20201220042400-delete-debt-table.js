'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('debts');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('debts');
    },
};
