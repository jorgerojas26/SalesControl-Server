const Payment = require('../models').payment;

module.exports = {
    index: async function (req, res, next) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            next();
        } else {
            res.status(401).json({ error: 'Insuficcient permissions' });
        }
    },
    create: async function (req, res) {},
    update: async function (req, res) {},
    delete: async function (req, req) {},
};
