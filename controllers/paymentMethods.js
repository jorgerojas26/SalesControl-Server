const paymentMethod = require('../models').paymentmethod;

module.exports = {
    index: async function (req, res, next) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            next();
        } else {
            res.status(401).send('Insufficient permissions');
        }
    },
    create: async function (req, res) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            const { name, isActive } = req.body;

            if (name && isActive) {
                try {
                    const newPaymentMethod = await paymentMethod.create({
                        name,
                        isActive,
                    });
                    res.status(200).send(newPaymentMethod);
                } catch (error) {
                    res.status(400).json({ error });
                }
            }
        } else {
            res.status(401).send('Insufficient permissions');
        }
    },
};
