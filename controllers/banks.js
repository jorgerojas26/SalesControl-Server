const bank = require('../models').bank;

module.exports = {
    index: function (req, res, next) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            next();
        } else {
            res.status(401).json({ error: 'Insufficient permissions' });
        }
    },
    create: async function (req, res) {
        if (req.user.permissions >= process.env.EMPLOYEE_PERMISSION) {
            let { bankName, accountNumber, ownerDocNumber, accountType, ownerName } = req.body;

            if (bankName && accountNumber && ownerDocNumber && accountType && ownerName) {
                try {
                    let newBank = await bank.create({
                        bankName,
                        accountNumber,
                        ownerDocNumber,
                        accountType,
                        ownerName,
                    });
                    res.status(200).json(newBank);
                } catch (error) {
                    res.status(400).json({ error });
                }
            } else {
                res.status(400).json({ error: 'Empty fields' });
            }
        } else {
            res.status(401).json({ error: 'Insufficient permissions' });
        }
    },
};
