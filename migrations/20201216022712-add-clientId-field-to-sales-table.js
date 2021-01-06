'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('sales', 'clientId', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
            after: 'id',
            references: {
                model: 'clients',
                key: 'id',
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('sales', 'clientId');
    },
};
