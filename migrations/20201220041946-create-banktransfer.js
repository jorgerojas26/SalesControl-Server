'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('banktransfers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            paymentId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'payments',
                    key: 'id',
                },
            },
            referenceCode: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            bankId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'banks',
                    key: 'id',
                },
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('banktransfers');
    },
};