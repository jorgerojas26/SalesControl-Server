'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('banks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            bankName: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            accountNumber: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true,
            },
            ownerDocNumber: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            accountType: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            ownerName: {
                type: Sequelize.TEXT,
                allowNull: false,
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
        await queryInterface.dropTable('banks');
    },
};

