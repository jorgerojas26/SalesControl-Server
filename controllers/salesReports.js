const Sales = require("../models").Sales;
const Client = require("../models").Client;
const SaleProducts = require("../models").SaleProducts;
const Product = require("../models").Product;
const Sequelize = require("sequelize");
const sequelizeModel = require("../models").sequelize;

module.exports = {
    index: async function (req, res) {
        let { startDate, endDate } = req.query;

        if (startDate && endDate) {
            let response = await sequelizeModel.query(`
            SELECT 
            a.productId,
            a.productName,
            SUM(a.quantity) as soldQuantity,
            SUM(a.grossIncome) as grossIncome,
            SUM(a.netIncome) as netIncome,
            SUM(a.grossIncomeBs) as grossIncomeBs,
            SUM(a.netIncomeBs) as netIncomeBs
            FROM
            (SELECT
                products.id as productId,
                products.name as productName,
                saleproducts.price,
                saleproducts.quantity,
                saleproducts.profitPercent,
                sales.dolarReference,
                ROUND(saleproducts.price * quantity, 2) as grossIncome,
                ROUND(saleproducts.price * quantity * (saleproducts.profitPercent / 100), 2) as netIncome,
                ROUND(saleproducts.price * quantity * sales.dolarReference) as grossIncomeBs,
                ROUND(saleproducts.price * quantity * (saleproducts.profitPercent / 100), 2) * sales.dolarReference as netIncomeBs
                FROM saleproducts
                INNER JOIN products ON saleproducts.productId = products.id
                INNER JOIN sales ON sales.id = saleproducts.saleId
                WHERE DATE(saleproducts.createdAt) BETWEEN DATE(:startDate) AND DATE(:endDate)
                ) a
                group by a.productId

            `, { replacements: { startDate, endDate }, type: Sequelize.QueryTypes.SELECT });
            /*
            let response = await sequelizeModel.query(`
        SELECT 
        products.id as productId,
        products.name as productName,
        saleproducts.price,
        saleproducts.quantity,
        saleproducts.profitPercent,
        sales.dolarReference,
        ROUND(saleproducts.price * quantity, 2) as grossIncome,
        ROUND(saleproducts.price * quantity * (saleproducts.profitPercent / 100), 2) as netIncome,
        ROUND(saleproducts.price * quantity * sales.dolarReference) as grossIncomeBs,
        ROUND(saleproducts.price * quantity * (saleproducts.profitPercent / 100), 2) * sales.dolarReference as netIncomeBs
        FROM saleproducts
        INNER JOIN products ON saleproducts.productId = products.id
        INNER JOIN sales ON sales.id = saleproducts.saleId
        WHERE DATE(saleproducts.createdAt) BETWEEN DATE(:startDate) AND DATE(:endDate) 
        `, { replacements: { startDate, endDate }, type: Sequelize.QueryTypes.SELECT });
        */
            res.send(response);
        }
    },
    payments: async function (req, res) {
        let { startDate, endDate } = req.query;

        let response = await sequelizeModel.query(`
        SELECT
        paymentmethods.id,
        paymentmethods.name as paymentMethodName,
        SUM(payments.amount) as amount,
        payments.currency
        FROM payments
        LEFT JOIN cash ON cash.paymentId = payments.id
        INNER JOIN paymentmethods ON paymentmethods.id = payments.paymentMethodId 
        WHERE DATE(payments.createdAt) BETWEEN DATE(:startDate) AND DATE(:endDate) 
        group by payments.paymentMethodId, payments.currency
        `, { replacements: { startDate, endDate }, type: Sequelize.QueryTypes.SELECT });
        res.send(response);

    },
    debts: async function (req, res) {
        let { startDate, endDate } = req.query;
        let response = await Sales.findAll({
            include: [
                {
                    model: Client,
                    as: "client",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                },
                {
                    model: SaleProducts,
                    as: "saleProducts",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "saleId", "productId"]
                    },
                    include: [{
                        model: Product,
                        as: "product",
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        }
                    }]
                },
                "payment"
            ],
            where: {
                [Sequelize.Op.and]: [
                    {
                        [Sequelize.Op.or]: [
                            Sequelize.where(Sequelize.fn("DATE", Sequelize.col("Sales.createdAt")), { [Sequelize.Op.between]: [startDate, endDate] }),
                            Sequelize.where(Sequelize.fn("DATE", Sequelize.col("Sales.fullyPaidDate")), { [Sequelize.Op.between]: [startDate, endDate] }),
                        ]
                    },
                    {
                        [Sequelize.Op.or]: [
                            {
                                fullyPaidDate: {
                                    [Sequelize.Op.gt]: Sequelize.col("Sales.createdAt")
                                }
                            },
                            {
                                fullyPaidDate: null

                            }
                        ]
                    },
                ]
            },
            attributes: {
                exclude: [
                    "updatedAt",
                    "clientId"
                ]
            }
        });
        /*
         let response = await sequelizeModel.query(`
         SELECT 
         clients.id as clientId,
         clients.name as clientName,
         sales.isPaid,
         sales.fullyPaidDate,
         saleproducts.*
         FROM sales
         LEFT JOIN clients ON clients.id = sales.clientId
         INNER JOIN saleproducts ON saleproducts.saleId = sales.id
         WHERE DATE(sales.createdAt) BETWEEN DATE(:startDate) AND DATE(:endDate) 
         AND (sales.fullyPaidDate > sales.createdAt OR sales.fullyPaidDate IS NULL)
         group by saleproducts.id
         `, { replacements: { startDate, endDate }, type: Sequelize.QueryTypes.SELECT });
         */
        res.send(response);

    }
};