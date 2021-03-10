module.exports = {
  up: async (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('paymentmethods', [
      {
        name: "point of sale",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()

      },
      {
        name: "cash",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()

      },
      {
        name: "bank transfer",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});

  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('paymentmethods', null, {});

  }
};
