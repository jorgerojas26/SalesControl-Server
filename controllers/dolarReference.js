const DolarReference = require('../models').DolarReference;

const sequelize = require('sequelize');
const Op = sequelize.Op;
module.exports = {
    index: async function (req, res, next) {
        let queryObject = {};
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            queryObject.limit = 1;
            queryObject.order = [['id', 'desc']];

            res.queryObject = queryObject;
            res.findOne = true;
            next();
        } else {
            next('Insuficcient permissions');
        }
    },
    create: function (req, res) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            console.log(req.body);
            try {
                DolarReference.create({
                    price: req.body.price,
                });
                res.sendStatus(204);
            } catch (error) {
                res.status(500).json({ error });
            }
        } else {
            next('Insuficcient permissions');
        }
    },
};

