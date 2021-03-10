module.export = {
    calculateSaleTotal: (sale, frozenPrice, currentDolarReference) => {
        let saleTotal = 0;
        sale.saleProducts.forEach(saleProduct => {
            let productPrice = (frozenPrice) ? saleProduct.price : saleProduct.product.price;
            saleTotal += roundUpProductPrice(productPrice * (frozenPrice ? sale.dolarReference : currentDolarReference)) * saleProduct.quantity;
        });
        return Math.round(saleTotal);
    },
    calculatePaymentsTotal(payments) {
        let paymentTotal = 0;
        payments.forEach(pm => {
            if (pm.currency == 'USD') {
                let dolarReference = 0;
                let paymentTypeArray = pm[pm.paymentmethod.name.toLowerCase().replace(/-/g, '')];
                paymentTypeArray.forEach(type => {
                    if (type.paymentId == pm.id) {
                        dolarReference = type.dolarReference;
                    }
                });
                paymentTotal += pm.amount * dolarReference;
            } else {
                paymentTotal += pm.amount;
            }
        });
        return Math.round(paymentTotal);
    },
}