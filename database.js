const mariadb = require("mariadb")
const Sequelize = require("sequelize");

const sequelize = new Sequelize("supermercado-melquisedec", "root", null, {
    dialect: "mariadb"
});




