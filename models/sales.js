'use strict';
const { Model } = require('sequelize');
const { roundUpProductPrice } = require("../helpers/products");
module.exports = (sequelize, DataTypes) => {
    class Sales extends Model {
        static associate(models) {
            Sales.belongsToMany(models.Product, {
                through: 'saleproducts',
                foreignKey: 'saleId',
                sourceKey: 'id',
            });

            Sales.hasMany(models.SaleProducts, {
                as: 'saleProducts',
                foreignKey: 'saleId',
                sourceKey: 'id',
                onDelete: 'cascade'
            });

            Sales.hasMany(models.payment, {
                as: 'payment',
                foreignKey: 'saleId',
                sourceKey: 'id',
                onDelete: "cascade"
            });

            Sales.belongsTo(models.Client, {
                as: "client",
                foreignKey: "clientId",
                sourceKey: "id"
            });
        }
    }
    Sales.init(
        {
            clientId: DataTypes.INTEGER,
            isPaid: DataTypes.BOOLEAN,
            fullyPaidDate: DataTypes.DATE,
            dolarReference: DataTypes.FLOAT
        },
        {
            sequelize,
            modelName: 'Sales',
            tableName: 'sales',
        },
    );

    Sales.afterFind(async results => {
        if (results && results instanceof Array) {
            for (let sale of results) {
                let currentDolarReference = await sequelize.models.DolarReference.findOne({ order: [["id", "DESC"]] });
                currentDolarReference = currentDolarReference.dataValues.price;
                let freezedDolarReference = sale.dataValues.dolarReference;
                let saleProducts = sale.dataValues.saleProducts || [];
                let client = sale.dataValues.client;
                let clientIsEmployee = false;
                if (client) {
                    process.env.EMPLOYEE_CED.split(",").map(cedula => {
                        if (client.cedula == cedula) {
                            clientIsEmployee = true;
                        }
                    });
                }
                let fullyPaidDate = sale.dataValues.fullyPaidDate;
                let payments = sale.dataValues.payment || [];
                let products = [];

                let invoiceTotalBs = 0;
                let freezedInvoiceTotalBs = 0;
                let finalInvoiceTotalBs = 0;
                let paymentTotalBs = 0;
                let debtor = null;
                //payment total calculation
                payments.forEach(pm => {
                    pm = pm.dataValues;
                    if (pm.currency == 'USD') {
                        let dolarReference = 0;
                        let paymentTypeArray = pm[pm.paymentmethod.name.toLowerCase().replace(/-/g, '')];
                        paymentTypeArray.forEach(type => {
                            if (type.paymentId == pm.id) {
                                dolarReference = type.dolarReference;
                            }
                        });
                        paymentTotalBs += pm.amount * dolarReference;
                    } else {
                        paymentTotalBs += pm.amount;
                    }
                });

                saleProducts.map(saleProduct => {
                    let freezedProductInfo = saleProduct.dataValues;
                    let currentProductInfo = saleProduct.dataValues.product.dataValues;

                    freezedInvoiceTotalBs += freezedProductInfo.price * freezedDolarReference;
                    invoiceTotalBs += currentProductInfo.price * currentDolarReference;
                });

                if (paymentTotalBs < freezedInvoiceTotalBs) {
                    debtor = "client";
                }
                else if (paymentTotalBs > freezedInvoiceTotalBs) {
                    debtor = "business";
                }

                saleProducts.map(saleProduct => {
                    let freezedProductInfo = saleProduct.dataValues;
                    let currentProductInfo = saleProduct.dataValues.product.dataValues;
                    let productPriceBs = 0;
                    let productDiscount = 0;
                    if (fullyPaidDate != null && fullyPaidDate != "") { // if already paid then i only need a history view of this sale
                        productPriceBs = roundUpProductPrice(Math.round(freezedProductInfo.price * freezedDolarReference));
                        productDiscount = clientIsEmployee
                            ? Math.round((productPriceBs - Math.round(productPriceBs / ((100 + freezedProductInfo.profitPercent) / 100))) / 1000) * 1000
                            : 0;
                    }
                    else {
                        if (debtor == "business" || debtor == null) {
                            productPriceBs = roundUpProductPrice(Math.round(freezedProductInfo.price * freezedDolarReference));
                        }
                        else if (debtor == "client") {
                            let freezedProductPrice = roundUpProductPrice(Math.round(freezedProductInfo.price * freezedDolarReference));
                            let currentProductPrice = roundUpProductPrice(Math.round(currentProductInfo.price * currentDolarReference));

                            productPriceBs = freezedProductPrice >= currentProductPrice ? freezedProductPrice : currentProductPrice;
                        }
                        productDiscount = clientIsEmployee
                            ? Math.round((productPriceBs - Math.round(productPriceBs / ((100 + currentProductInfo.profitPercent) / 100))) / 1000) * 1000
                            : 0;
                    }
                    finalInvoiceTotalBs += (productPriceBs - productDiscount) * freezedProductInfo.quantity;
                    products.push({
                        id: saleProduct.productId,
                        name: currentProductInfo.name,
                        imagePath: currentProductInfo.imagePath,
                        unitPriceBs: productPriceBs,
                        quantity: saleProduct.quantity,
                        totalBs: (productPriceBs - productDiscount) * freezedProductInfo.quantity,
                        discount: productDiscount
                    });
                });

                sale.dataValues.invoiceTotalBs = finalInvoiceTotalBs;
                sale.dataValues.paymentTotalBs = paymentTotalBs;
                sale.dataValues.debtTotal = Math.round(finalInvoiceTotalBs - paymentTotalBs);
                sale.dataValues.debtCurrency = "Bs";
                sale.dataValues.products = products;
            }
        }
    });
    return Sales;
};
