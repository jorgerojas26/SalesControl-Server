const mariadb = require('mariadb');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('supermercado-melquisedec', 'supermercadoMelquisedecAdmin', 'Jj20Rr3$', {
    dialect: 'mariadb',
});
