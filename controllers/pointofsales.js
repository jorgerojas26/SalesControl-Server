const PointOfSales = require('../models').pointofsale;
const Sequelize = require("sequelize");
const sequelizeModel = require("../models").sequelize;

module.exports = {
    index: async function (req, res) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            
            try{
            let response = await PointOfSales.max("ticketId")
            res.status(200).json({ticketId: response});
            }catch(error){
            res.status(400).send(error.toString())
            }
            
        } else {
            res.status(401).json({ error: 'Insufficient permissions' });
        }
    },
};
