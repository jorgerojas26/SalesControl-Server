'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('Users', [
      {
        email: 'jorgeluisrojasb@gmail.com',
        password: "$2b$10$w0.e1X2T4Knfkb/K3Cn7de9r0M84cdd5E3wkBrv5yfnoTgH0ukz.q",
        permissions: 4,
        createdAt: new Date(),
        updatedAt: new Date()

      }
    ], {});

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('Users', null, {});

  }
};
