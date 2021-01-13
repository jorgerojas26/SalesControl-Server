const PointOfSales = require('../models').pointofsales;

module.exports = {
    index: function (req, res, next) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            let { order } = req.query;
            let queryObject = {};

            if (order) {
                queryObject.order = [['id', order]];
            }
            res.queryObject = queryObject;
            next();
        } else {
            res.status(401).json({ error: 'Insufficient permissions' });
        }
    },
};
